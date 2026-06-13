import { NextResponse } from "next/server";
const PDFParser = require("pdf2json");
import * as xlsx from "xlsx";

const SYSTEM_PROMPT = `You are a professional IT business analyst generating quotations.
You MUST return a raw, valid JSON object (no markdown formatting, no backticks).
The JSON MUST strictly match this interface:
{
  "meta": {
    "companyName": "string",
    "clientDesignation": "string",
    "repName1": "string",
    "repName2": "string",
    "gstin": "string",
    "quotationNumber": "string",
    "date": "string (DD MMMM YYYY)",
    "validity": "string",
    "providers1": "string",
    "providers2": "string"
  },
  "data": {
    "title": "string (project name)",
    "description": "string (executive summary)",
    "modules": [ { "name": "string", "description": "string", "cost": number } ],
    "deliveryPlan": [ { "week": "string (e.g. Week 1)", "tasks": "string" } ],
    "deliverables": [ "string" ],
    "paymentMilestones": [ { "percentage": number, "amount": number, "description": "string" } ],
    "assumptions": [ "string" ],
    "exclusions": [ "string" ],
    "totalCost": number,
    "serviceProviders": [ { "name": "string", "designation": "string" } ]
  }
}

CRITICAL RULES:
1. The 'totalCost' MUST exactly equal the sum of all 'cost' in 'modules'. Split the price realistically according to the tasks.
2. The sum of 'percentage' in 'paymentMilestones' MUST be exactly 100.
3. The 'amount' in each milestone MUST be exactly (percentage * totalCost / 100).
4. Output ONLY valid JSON. Do NOT include any explanations or markdown backticks.
5. Extract as much real data from the provided document text as possible (including Company Name, Rep Names, GSTIN, Quotation Number, Date, etc). If some fields are missing in the document, generate realistic placeholder data based on the context.
6. Extract ALL delivery weeks dynamically from the document. Do NOT assume a fixed number of weeks. If the document contains 8 weeks, return 8 objects. If the document contains 12 weeks, return 12 objects. Preserve exact week names and tasks from the document. If no delivery plan exists, generate a realistic one based on project scope.
7. Extract all modules dynamically including names, descriptions, and costs.
8. Extract deliverables dynamically.
9. Extract assumptions and exclusions dynamically.
10. Extract payment milestones dynamically and ensure percentages total 100%.`;

function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    pdfParser.on("pdfParser_dataError", (errData: any) =>
      reject(errData.parserError),
    );
    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    // Parse the file based on its type
    if (file.name.toLowerCase().endsWith(".pdf")) {
      extractedText = await parsePdfBuffer(buffer);
    } else if (
      file.name.toLowerCase().endsWith(".xls") ||
      file.name.toLowerCase().endsWith(".xlsx")
    ) {
      const workbook = xlsx.read(buffer, { type: "buffer" });
      extractedText = workbook.SheetNames.map((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_csv(sheet);
      }).join("\n\n");
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF or Excel file." },
        { status: 400 },
      );
    }

    // Truncate text if it's absurdly large to prevent completely blowing out token limits
    if (extractedText.length > 30000) {
      extractedText =
        extractedText.substring(0, 30000) +
        "\n\n[TEXT TRUNCATED DUE TO LENGTH]";
    }

    const apiKey = process.env.OPENAI_API_KEY || "free-api-key";
    const baseURL =
      process.env.OPENAI_BASE_URL || "https://chatgpt-api.shn.hk/v1";

    try {
      const response = await fetch(`${baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Extract and structure a quotation based on the following document content:\n\n${extractedText}`,
            },
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API responded with status ${response.status}`);
      }

      const data = await response.json();
      let aiContent = data.choices[0].message.content.trim();

      if (aiContent.startsWith("```json")) aiContent = aiContent.substring(7);
      if (aiContent.startsWith("```")) aiContent = aiContent.substring(3);
      if (aiContent.endsWith("```"))
        aiContent = aiContent.substring(0, aiContent.length - 3);

      const quotation = JSON.parse(aiContent.trim());
      return NextResponse.json(quotation);
    } catch (apiError: any) {
      console.warn(
        "External AI API failed, falling back to manual regex extraction.",
        apiError.message,
      );

      const cleanText = extractedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      
      const totalCostMatch = cleanText.match(/₹\s?([\d,]+)/) || cleanText.match(/(?:Total|Cost|Price).*?([\d,]+)/i);
      const totalCost = totalCostMatch ? parseInt(totalCostMatch[1].replace(/,/g, '')) : 120000;
      
      const rep1Match = cleanText.match(/Rep 1:\s*(.*?)(?=\s{2,}|\t|Provider|Trade|Type|$)/i);
      const repName1 = rep1Match ? rep1Match[1].trim() : "Representative";

      const rep2Match = cleanText.match(/Rep 2:\s*(.*?)(?=\s{2,}|\t|Provider|Trade|Type|$)/i);
      const repName2 = rep2Match ? rep2Match[1].trim() : "Director";

      const provider1Match = cleanText.match(/Provider 1:\s*(.*?)(?=\s{2,}|\t|$)/i);
      const providers1 = provider1Match ? provider1Match[1].trim() : "";

      const provider2Match = cleanText.match(/Provider 2:\s*(.*?)(?=\s{2,}|\t|$)/i);
      const providers2 = provider2Match ? provider2Match[1].trim() : "";

      const tradeMatch = cleanText.match(/Trade\/Brand:\s*(.*?)(?=\s{2,}|\t|$)/i);
      const trade = tradeMatch ? tradeMatch[1].trim() : "";

      const typeMatch = cleanText.match(/Type:\s*(.*?)(?=\s{2,}|\t|$)/i);
      const type = typeMatch ? typeMatch[1].trim() : "";

      const companyNameMatch = cleanText.match(/BILL TO.*?COMPANY[^\n]*\n\s*([A-Za-z].*?)(?=\s{2,}|\t|Provider|$)/i) || cleanText.match(/COMPANY[^\n]*\n\s*(.+?)(?=\s{2,}|\t|$)/i);
      const companyName = companyNameMatch ? companyNameMatch[1].trim() : "Imported Company";

      const titleMatch = cleanText.match(/(RTO Agent Pro[^\\n\t]{0,50})/i) || cleanText.match(/(?:Project|Proposal|System)[\s:\-]*([A-Za-z\s]{5,40})/i);
      const title = titleMatch ? titleMatch[1].trim() : "Imported Project Proposal";

      // Dynamic Module Extraction
      const modules = [];
      const moduleRegex = /(\d+)\s+([^\n]+?)\s*₹([\d,]+)/g;
      let match;
      while ((match = moduleRegex.exec(cleanText)) !== null) {
        modules.push({
          name: match[2].trim(),
          description: "Extracted feature from document.",
          cost: parseInt(match[3].replace(/,/g, ''))
        });
      }
      if (modules.length === 0) {
        modules.push({ name: "Primary Module", description: "Core features extracted from document.", cost: Math.round(totalCost * 0.4) });
        modules.push({ name: "Secondary Module", description: "Additional features and deployment.", cost: totalCost - Math.round(totalCost * 0.4) });
      }

      // Dynamic Delivery Plan Extraction
      const deliveryPlan = [];
      const weekRegex = /(Week\s+\d+)\s+([^\n]+)/gi;
      while ((match = weekRegex.exec(cleanText)) !== null) {
        if (!match[2].toLowerCase().includes('planned work')) {
          deliveryPlan.push({ week: match[1], tasks: match[2].trim() });
        }
      }
      if (deliveryPlan.length === 0) {
        deliveryPlan.push({ week: "Week 1", tasks: "Initial Setup & Requirements" });
        deliveryPlan.push({ week: "Week 2", tasks: "Development & Delivery" });
      }

      // Dynamic Deliverables Extraction
      const deliverables = [];
      const deliverablesMatch = cleanText.match(/DELIVERABLES[\s\S]*?(?=\n\d+\)|PAYMENT|$)/i);
      if (deliverablesMatch) {
        const items = deliverablesMatch[0].split('\n').map(l => l.trim()).filter(l => l.length > 5 && !l.includes('DELIVERABLES') && !l.includes('Full source code'));
        deliverables.push(...items.slice(0, 5)); // Take up to 5 extracted lines
      }
      if (deliverables.length === 0) {
        deliverables.push("Source Code", "Documentation");
      }

      // Dynamic Payment Milestones Extraction
      const paymentMilestones = [];
      const milestoneRegex = /([^\n]+?)\s+(\d+)%\s*₹([\d,]+)/g;
      while ((match = milestoneRegex.exec(cleanText)) !== null) {
        paymentMilestones.push({
          percentage: parseInt(match[2]),
          amount: parseInt(match[3].replace(/,/g, '')),
          description: match[1].trim()
        });
      }
      if (paymentMilestones.length === 0) {
        paymentMilestones.push({ percentage: 50, amount: Math.round(totalCost * 0.5), description: "Advance" });
        paymentMilestones.push({ percentage: 50, amount: totalCost - Math.round(totalCost * 0.5), description: "On Delivery" });
      }

      // Dynamic Assumptions & Exclusions
      const assumptionsMatch = cleanText.match(/ASSUMPTIONS & EXCLUSIONS[\s\S]*?(?=\n\d+\)|SIGNATORIES|$)/i);
      const assumptions = [];
      if (assumptionsMatch) {
         const items = assumptionsMatch[0].split('\n').map(l => l.trim()).filter(l => l.length > 10 && !l.includes('ASSUMPTIONS'));
         assumptions.push(...items.slice(0, 4));
      }
      if (assumptions.length === 0) {
        assumptions.push("Client will provide necessary resources.");
      }

      const fallbackJSON = {
        meta: {
          companyName: companyName,
          clientDesignation: "CEO",
          repName1: repName1,
          repName2: repName2,
          gstin: "N/A",
          quotationNumber: `QUO-${new Date().getFullYear()}-001`,
          date: new Date().toLocaleDateString("en-IN"),
          validity: "15 Days",
          providers1: providers1,
          providers2: providers2,
          trade: trade,
          type: type
        },
        data: {
          title: title,
          description: `A comprehensive digital solution extracted from the uploaded document.\nNOTE: The AI endpoint was offline, so this was extracted using basic fallback pattern matching.`,
          modules: modules,
          deliveryPlan: deliveryPlan,
          deliverables: deliverables,
          paymentMilestones: paymentMilestones,
          assumptions: assumptions,
          exclusions: ["Third-party API costs."],
          totalCost: totalCost,
          serviceProviders: [
            { name: "Hemant Chandra", designation: "Founder" },
            { name: providers2 || "Avinash Chandraker", designation: "Co-Founder" }
          ],
        },
      };

      return NextResponse.json(fallbackJSON);
    }
  } catch (error: any) {
    console.error("Failed to parse file:", error);
    return NextResponse.json(
      { error: `Failed to process the uploaded file: ${error.message}` },
      { status: 500 },
    );
  }
}
