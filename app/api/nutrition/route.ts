import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { age, weight, height, goal, dietType } = body;

        const apiKey = process.env.OPENAI_API_KEY;

        // If no API key, return built-in nutrition data
        if (!apiKey) {
            return NextResponse.json({
                success: true,
                source: "built-in",
                plan: generateFallbackNutritionPlan(goal, dietType, weight),
            });
        }

        const prompt = `Generate a personalized daily meal plan.
Inputs:
- Age: ${age}
- Weight: ${weight} kg
- Height: ${height} cm
- Goal: ${goal} (muscle_gain / fat_loss / endurance)
- Diet Type: ${dietType} (vegetarian / non-vegetarian)

Return a JSON object with:
- dailyCalories: number
- protein: string (e.g. "140g")
- carbs: string
- fat: string
- meals: array of { meal: string, foods: array of strings, calories: number }
- hydrationTip: string
- supplementTip: string

Return ONLY valid JSON, no markdown.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a certified nutritionist and sports dietitian. Always respond with valid JSON." },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 1200,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        const plan = JSON.parse(content);

        return NextResponse.json({ success: true, source: "ai", plan });
    } catch (error) {
        console.error("Nutrition AI error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate nutrition plan" },
            { status: 500 }
        );
    }
}

function generateFallbackNutritionPlan(goal: string, dietType: string, weight: number) {
    const isVeg = dietType === "vegetarian";
    const calorieMultiplier = goal === "muscle_gain" ? 32 : goal === "fat_loss" ? 22 : 28;
    const dailyCal = Math.round(weight * calorieMultiplier);

    const proteinMultiplier = goal === "muscle_gain" ? 2.0 : goal === "fat_loss" ? 1.8 : 1.5;
    const protein = Math.round(weight * proteinMultiplier);
    const fat = Math.round(dailyCal * 0.25 / 9);
    const carbs = Math.round((dailyCal - protein * 4 - fat * 9) / 4);

    const meals = isVeg
        ? [
            { meal: "Breakfast", foods: ["Oats with Milk", "Banana", "Peanut Butter", "Green Tea"], calories: Math.round(dailyCal * 0.25) },
            { meal: "Lunch", foods: ["Brown Rice", "Paneer Curry", "Dal", "Mixed Salad"], calories: Math.round(dailyCal * 0.35) },
            { meal: "Snack", foods: ["Greek Yogurt", "Mixed Nuts", "Apple"], calories: Math.round(dailyCal * 0.15) },
            { meal: "Dinner", foods: ["Chapati", "Soybean Curry", "Steamed Vegetables"], calories: Math.round(dailyCal * 0.25) },
        ]
        : [
            { meal: "Breakfast", foods: ["Eggs (4)", "Whole Wheat Toast", "Avocado", "Black Coffee"], calories: Math.round(dailyCal * 0.25) },
            { meal: "Lunch", foods: ["Grilled Chicken", "Brown Rice", "Steamed Broccoli", "Salad"], calories: Math.round(dailyCal * 0.35) },
            { meal: "Snack", foods: ["Protein Shake", "Banana", "Almonds"], calories: Math.round(dailyCal * 0.15) },
            { meal: "Dinner", foods: ["Baked Salmon", "Quinoa", "Roasted Vegetables"], calories: Math.round(dailyCal * 0.25) },
        ];

    return {
        dailyCalories: dailyCal,
        protein: `${protein}g`,
        carbs: `${carbs}g`,
        fat: `${fat}g`,
        meals,
        hydrationTip: `Drink at least ${Math.round(weight * 0.04 * 10) / 10} liters of water daily.`,
        supplementTip: goal === "muscle_gain"
            ? "Consider creatine monohydrate (5g/day) and whey protein post-workout."
            : goal === "fat_loss"
                ? "Green tea extract and L-carnitine may support fat oxidation."
                : "BCAAs during long workouts can help with endurance.",
    };
}
