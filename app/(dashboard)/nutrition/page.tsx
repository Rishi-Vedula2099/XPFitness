"use client";

import { useUserStore } from "@/store/userStore";
import { useTheme } from "@/components/ThemeProvider";
import { getNutritionPlan } from "@/lib/nutritionData";
import { useState } from "react";

export default function NutritionPage() {
    const { themeConfig } = useTheme();
    const { goal, dietType, weight, height, age, setProfile } = useUserStore();
    const [showSettings, setShowSettings] = useState(false);

    const plan = getNutritionPlan(goal || "muscle_gain", dietType || "vegetarian");

    const goals = [
        { value: "muscle_gain", label: "Muscle Gain 💪", desc: "High protein diet" },
        { value: "fat_loss", label: "Fat Loss 🔥", desc: "Calorie deficit" },
        { value: "endurance", label: "Endurance 🏃", desc: "Balanced macros" },
    ];

    return (
        <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>
                    AI Nutrition System
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
                    🥗 Personalized Diet Plan
                </h1>
                <p style={{ color: "var(--muted-foreground)", fontSize: 14 }}>
                    AI-generated meal plans based on your body metrics and fitness goals.
                </p>
            </div>

            {/* Goal Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
                {goals.map((g) => (
                    <button
                        key={g.value}
                        onClick={() => setProfile({ goal: g.value as "muscle_gain" | "fat_loss" | "endurance" })}
                        className="glass-card"
                        style={{
                            padding: 20,
                            cursor: "pointer",
                            textAlign: "center",
                            borderColor: goal === g.value ? "var(--primary)" : undefined,
                            background: goal === g.value ? "var(--theme-aura)" : undefined,
                        }}
                    >
                        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{g.label}</div>
                        <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{g.desc}</div>
                    </button>
                ))}
            </div>

            {/* Diet Type Toggle */}
            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
                {(["vegetarian", "non-vegetarian"] as const).map((dt) => (
                    <button
                        key={dt}
                        onClick={() => setProfile({ dietType: dt })}
                        style={{
                            flex: 1,
                            padding: "14px 20px",
                            borderRadius: 12,
                            border: dietType === dt ? "1px solid var(--primary)" : "1px solid var(--border)",
                            background: dietType === dt ? "var(--theme-aura)" : "var(--card)",
                            color: dietType === dt ? "var(--primary)" : "var(--foreground)",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        {dt === "vegetarian" ? "🥦 Vegetarian" : "🍗 Non-Vegetarian"}
                    </button>
                ))}
            </div>

            {plan ? (
                <>
                    {/* Macros */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: 12,
                            marginBottom: 28,
                        }}
                    >
                        {[
                            { label: "Calories", value: `${plan.dailyCalories}`, unit: "kcal", color: "#ff6b00" },
                            { label: "Protein", value: plan.protein, unit: "", color: "#e63946" },
                            { label: "Carbs", value: plan.carbs, unit: "", color: "#7b2ff7" },
                            { label: "Fat", value: plan.fat, unit: "", color: "#00b4d8" },
                        ].map((m, i) => (
                            <div key={i} className="stat-card" style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 6 }}>{m.label}</div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: m.color }}>
                                    {m.value}
                                </div>
                                {m.unit && <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{m.unit}</div>}
                            </div>
                        ))}
                    </div>

                    {/* Meal Plan */}
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>📍 Daily Meal Plan</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {plan.meals.map((meal, i) => (
                            <div
                                key={i}
                                className="glass-card"
                                style={{ padding: 22 }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                    <div
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 8,
                                            background: "var(--theme-aura)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 16,
                                        }}
                                    >
                                        {i === 0 ? "🌅" : i === 1 ? "☀️" : i === 2 ? "🍿" : "🌙"}
                                    </div>
                                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>{meal.meal}</h3>
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {meal.foods.map((food, j) => (
                                        <span
                                            key={j}
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: 8,
                                                background: "var(--secondary)",
                                                fontSize: 13,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {food}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="glass-card" style={{ padding: 40, textAlign: "center" }}>
                    <p style={{ color: "var(--muted-foreground)" }}>Select a goal and diet type to see your plan.</p>
                </div>
            )}
        </div>
    );
}
