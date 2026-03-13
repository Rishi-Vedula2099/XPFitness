import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { age, weight, height, goal, workoutTheme } = body;

        const apiKey = process.env.OPENAI_API_KEY;

        // If no API key, return a high-quality fallback response
        if (!apiKey) {
            return NextResponse.json({
                success: true,
                source: "built-in",
                plan: generateFallbackWorkoutPlan(goal, workoutTheme),
            });
        }

        const prompt = `Generate a scientifically proven workout plan.
Inputs:
- Age: ${age}
- Weight: ${weight} kg
- Height: ${height} cm
- Goal: ${goal}
- Workout Theme: ${workoutTheme}

Return a JSON object with:
- warmup: array of { exercise, duration }
- exercises: array of { name, sets, reps, restSeconds, muscleGroup, tips }
- cooldown: array of { exercise, duration }
- injuryPreventionTips: array of strings
- motivationalQuote: string

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
                    { role: "system", content: "You are a professional fitness trainer and sports scientist. Always respond with valid JSON." },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 1500,
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
        console.error("Workout AI error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate workout plan" },
            { status: 500 }
        );
    }
}

function generateFallbackWorkoutPlan(goal: string, theme: string) {
    const themeMap: Record<string, string> = {
        saiyan: "explosive power",
        shinobi: "agility and speed",
        hunter: "progressive overload",
        sorcerer: "controlled endurance",
    };

    return {
        warmup: [
            { exercise: "Light Jog", duration: "5 min" },
            { exercise: "Dynamic Stretching", duration: "5 min" },
            { exercise: "Arm Circles", duration: "2 min" },
        ],
        exercises: [
            { name: "Push Ups", sets: 4, reps: "12-15", restSeconds: 60, muscleGroup: "Chest", tips: "Keep core tight, full range of motion" },
            { name: "Squats", sets: 4, reps: "10-12", restSeconds: 90, muscleGroup: "Legs", tips: "Break parallel, drive through heels" },
            { name: "Pull Ups", sets: 3, reps: "8-10", restSeconds: 90, muscleGroup: "Back", tips: "Full extension at bottom" },
            { name: "Shoulder Press", sets: 3, reps: "10-12", restSeconds: 75, muscleGroup: "Shoulders", tips: "Don't arch lower back" },
            { name: "Plank", sets: 3, reps: "45 sec", restSeconds: 45, muscleGroup: "Core", tips: "Keep body in straight line" },
        ],
        cooldown: [
            { exercise: "Static Stretching", duration: "5 min" },
            { exercise: "Deep Breathing", duration: "3 min" },
        ],
        injuryPreventionTips: [
            "Always warm up before intense exercise",
            "Use proper form over heavy weight",
            "Stay hydrated throughout your workout",
            "Listen to your body — rest when needed",
            `Focus on ${themeMap[theme] || "balanced training"} for your ${theme} path`,
        ],
        motivationalQuote: goal === "muscle_gain"
            ? "The only bad workout is the one that didn't happen. Push beyond your limits!"
            : goal === "fat_loss"
                ? "Every rep burns another calorie. Stay consistent, warrior!"
                : "Endurance is not just about lasting — it's about keeping your power from start to finish!",
    };
}
