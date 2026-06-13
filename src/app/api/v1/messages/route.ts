import { NextResponse } from "next/server";

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
    "providers1": "string"
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
5. IMPORTANT: If the user does not specify a budget or cost, assume a realistic default totalCost between 80,000 to 2,00,000 INR based on the scope, and assign realistic prices to all modules. Do NOT output 0 costs.
6. Make up realistic placeholder data for the "meta" fields if they aren't provided in the prompt.`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

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
              content: `Generate a quotation based on this brief: ${prompt}`,
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
        "External AI API failed, falling back to dynamic mock generator.",
        apiError.message,
      );

      // Fallback Generator if the free API is offline
      const budgetMatch = prompt.match(/₹?([\d,]+)/);
      const totalCost = budgetMatch
        ? parseInt(budgetMatch[1].replace(/,/g, ""))
        : 120000;

      const mod1 = Math.round(totalCost * 0.35);
      const mod2 = Math.round(totalCost * 0.4);
      const mod3 = totalCost - mod1 - mod2;

      const fallbackJSON = {
        meta: {
          companyName: "Valued Client",
          clientDesignation: "CEO",
          repName1: "Representative",
          repName2: "Director",
          gstin: "N/A",
          quotationNumber: `QUO-${new Date().getFullYear()}-001`,
          date: new Date().toLocaleDateString("en-IN"),
          validity: "1",
          providers1: "",
          providers2: "",
          trade: "",
          type: "",
        },
        data: {
          title: "Custom Software Solution",
          description: `Based on your request: "${prompt}".\nThis is an automated fallback template generated because the free AI API endpoint is currently offline. You can edit all details below.`,
          modules: [
            {
              name: "Core Setup & Infrastructure",
              description:
                "Initial setup, database architecture, and authentication.",
              cost: mod1,
            },
            {
              name: "Primary Features Development",
              description:
                "Implementation of the requested core functionalities.",
              cost: mod2,
            },
            {
              name: "Testing, QA & Deployment",
              description:
                "Security audits, bug fixing, and server deployment.",
              cost: mod3,
            },
          ],
          deliveryPlan: [
            { week: "Week 1-2", tasks: "Requirement Analysis & Design" },
            { week: "Week 3-6", tasks: "Core Development Phase" },
            { week: "Week 7-8", tasks: "Testing & Final Deployment" },
          ],
          deliverables: [
            "Source Code Repository",
            "API Documentation",
            "Admin Dashboard",
            "Deployment Guide",
          ],
          paymentMilestones: [
            {
              percentage: 20,
              amount: Math.round(totalCost * 0.2),
              description: "Project Kick-off Advance",
            },
            {
              percentage: 40,
              amount: Math.round(totalCost * 0.4),
              description: "Mid-point Delivery",
            },
            {
              percentage: 40,
              amount:
                totalCost -
                Math.round(totalCost * 0.2) -
                Math.round(totalCost * 0.4),
              description: "Final Handover",
            },
          ],
          assumptions: [
            "Client will provide timely feedback.",
            "Third-party API keys are provided by the client.",
          ],
          exclusions: [
            "Ongoing server maintenance costs.",
            "Major scope changes after Week 2.",
          ],
          totalCost: totalCost,
          serviceProviders: [
            { name: "Rahul Sharma", designation: "Representative" },
          ],
        },
      };

      return NextResponse.json(fallbackJSON);
    }
  } catch (error: any) {
    console.error("Failed to generate quotation:", error);
    return NextResponse.json(
      { error: "Failed to process quotation" },
      { status: 500 },
    );
  }
}
