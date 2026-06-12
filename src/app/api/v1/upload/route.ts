import { NextResponse } from 'next/server';
// Polyfill required by pdf-parse in Node environments
if (typeof global !== "undefined") {
  if (!global.DOMMatrix) (global as any).DOMMatrix = class DOMMatrix {};
  if (!global.ImageData) (global as any).ImageData = class ImageData {};
  if (!global.Path2D) (global as any).Path2D = class Path2D {};
}

const pdfParse = require('pdf-parse');
import * as xlsx from 'xlsx';

const SYSTEM_PROMPT = `You are a professional IT business analyst generating quotations.
You MUST return a raw, valid JSON object (no markdown formatting, no backticks).
The JSON MUST strictly match this interface:
{
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

CRITICAL RULES:
1. The 'totalCost' MUST exactly equal the sum of all 'cost' in 'modules'. Split the price realistically according to the tasks.
2. The sum of 'percentage' in 'paymentMilestones' MUST be exactly 100.
3. The 'amount' in each milestone MUST be exactly (percentage * totalCost / 100).
4. Output ONLY valid JSON. Do NOT include any explanations or markdown backticks.
5. Extract as much real data from the provided document text as possible. If some fields are missing in the document, generate realistic placeholder data based on the context.`;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    // Parse the file based on its type
    if (file.name.toLowerCase().endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.xlsx')) {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      extractedText = workbook.SheetNames.map(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_csv(sheet);
      }).join("\n\n");
    } else {
      return NextResponse.json({ error: "Unsupported file type. Please upload a PDF or Excel file." }, { status: 400 });
    }

    // Truncate text if it's absurdly large to prevent completely blowing out token limits
    if (extractedText.length > 30000) {
      extractedText = extractedText.substring(0, 30000) + "\n\n[TEXT TRUNCATED DUE TO LENGTH]";
    }

    const apiKey = process.env.OPENAI_API_KEY || "free-api-key";
    const baseURL = process.env.OPENAI_BASE_URL || "https://chatgpt-api.shn.hk/v1";

    try {
      const response = await fetch(`${baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Extract and structure a quotation based on the following document content:\n\n${extractedText}` }
          ],
          temperature: 0.2
        })
      });

      if (!response.ok) {
        throw new Error(`AI API responded with status ${response.status}`);
      }

      const data = await response.json();
      let aiContent = data.choices[0].message.content.trim();
      
      if (aiContent.startsWith("```json")) aiContent = aiContent.substring(7);
      if (aiContent.startsWith("```")) aiContent = aiContent.substring(3);
      if (aiContent.endsWith("```")) aiContent = aiContent.substring(0, aiContent.length - 3);

      const quotation = JSON.parse(aiContent.trim());
      return NextResponse.json(quotation);
      
    } catch (apiError: any) {
      console.warn("External AI API failed.", apiError.message);
      // Let the frontend know the AI parsing failed
      return NextResponse.json({ error: "The AI API failed to parse the document. The document might be too large for the free tier, or the API is offline." }, { status: 502 });
    }
  } catch (error: any) {
    console.error("Failed to parse file:", error);
    return NextResponse.json({ error: "Failed to process the uploaded file." }, { status: 500 });
  }
}
