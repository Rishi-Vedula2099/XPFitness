import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get("image") as File;

        if (!imageFile) {
            return NextResponse.json(
                { success: false, error: "No image provided" },
                { status: 400 }
            );
        }

        const apiKey = process.env.OPENAI_API_KEY;

        // Convert image to base64
        const bytes = await imageFile.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const mimeType = imageFile.type || "image/jpeg";

        // If no API key, return demo data
        if (!apiKey) {
            return NextResponse.json({
                success: true,
                source: "demo",
                analysis: generateDemoAnalysis(),
            });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are a professional nutritionist and food recognition expert. 
Analyze the food in the image and provide detailed nutritional information.
Always respond with ONLY valid JSON, no markdown or extra text.`,
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `Analyze this food image and return a JSON object with:
{
  "foods": [
    {
      "name": "Food name",
      "portion": "Estimated portion size",
      "calories": number,
      "protein": number (grams),
      "carbs": number (grams),
      "fat": number (grams),
      "fiber": number (grams),
      "sugar": number (grams)
    }
  ],
  "totalCalories": number,
  "totalProtein": number,
  "totalCarbs": number,
  "totalFat": number,
  "mealType": "breakfast" | "lunch" | "dinner" | "snack",
  "healthScore": number (1-10),
  "healthNotes": "Brief health assessment",
  "suggestions": ["improvement suggestion 1", "suggestion 2"]
}
Return ONLY the JSON.`,
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${mimeType};base64,${base64}`,
                                    detail: "low",
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 1500,
                temperature: 0.3,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("OpenAI Vision error:", errorData);
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        // Clean potential markdown wrapping
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const analysis = JSON.parse(cleaned);

        return NextResponse.json({ success: true, source: "ai", analysis });
    } catch (error) {
        console.error("Food scan error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to analyze food image",
                analysis: generateDemoAnalysis(),
            },
            { status: 200 } // Still return 200 with demo data as fallback
        );
    }
}

function generateDemoAnalysis() {
    return {
        foods: [
            { name: "Grilled Chicken Breast", portion: "150g", calories: 248, protein: 46, carbs: 0, fat: 5, fiber: 0, sugar: 0 },
            { name: "Brown Rice", portion: "1 cup (195g)", calories: 216, protein: 5, carbs: 45, fat: 2, fiber: 4, sugar: 1 },
            { name: "Steamed Broccoli", portion: "1 cup (91g)", calories: 55, protein: 4, carbs: 11, fat: 1, fiber: 5, sugar: 2 },
        ],
        totalCalories: 519,
        totalProtein: 55,
        totalCarbs: 56,
        totalFat: 8,
        mealType: "lunch",
        healthScore: 9,
        healthNotes: "Excellent balanced meal with high protein, complex carbs, and vegetables. Great for muscle building goals.",
        suggestions: [
            "Add a healthy fat source like avocado or olive oil",
            "Consider adding a small side salad for more micronutrients",
        ],
    };
}
