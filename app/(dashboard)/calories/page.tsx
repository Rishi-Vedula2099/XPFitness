"use client";

import { useState, useMemo } from "react";
import { useCalorieStore, type FoodEntry } from "@/store/calorieStore";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

const MEAL_TYPES = [
    { value: "breakfast", label: "🌅 Breakfast" },
    { value: "lunch", label: "☀️ Lunch" },
    { value: "snack", label: "🍿 Snack" },
    { value: "dinner", label: "🌙 Dinner" },
];

const QUICK_FOODS = [
    { name: "Boiled Egg", calories: 78, protein: 6, carbs: 1, fat: 5 },
    { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
    { name: "Chicken Breast (150g)", calories: 248, protein: 46, carbs: 0, fat: 5 },
    { name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fat: 2 },
    { name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 1 },
    { name: "Protein Shake", calories: 150, protein: 30, carbs: 5, fat: 2 },
    { name: "Oats (1 cup)", calories: 307, protein: 11, carbs: 55, fat: 5 },
    { name: "Almonds (28g)", calories: 164, protein: 6, carbs: 6, fat: 14 },
];

function getTodayStart() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.getTime();
}

export default function CaloriesPage() {
    const { themeConfig } = useTheme();
    const { addEntry, removeEntry, dailyGoal, setDailyGoal } = useCalorieStore();
    const entries = useCalorieStore((s) => s.entries);

    const todayEntries = useMemo(() => {
        const start = getTodayStart();
        return entries.filter((e) => e.timestamp >= start);
    }, [entries]);

    const totals = useMemo(() => ({
        calories: todayEntries.reduce((s, e) => s + e.calories, 0),
        protein: todayEntries.reduce((s, e) => s + e.protein, 0),
        carbs: todayEntries.reduce((s, e) => s + e.carbs, 0),
        fat: todayEntries.reduce((s, e) => s + e.fat, 0),
    }), [todayEntries]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState("lunch");
    const [form, setForm] = useState({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0 });

    const calPercent = Math.min((totals.calories / dailyGoal) * 100, 100);
    const isOverGoal = totals.calories > dailyGoal;

    const handleAddManual = () => {
        if (!form.name || form.calories <= 0) return;
        addEntry({ ...form, meal: selectedMeal, source: "manual" });
        setForm({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0 });
        setShowAddForm(false);
    };

    const handleQuickAdd = (food: typeof QUICK_FOODS[0]) => {
        addEntry({ ...food, meal: selectedMeal, source: "manual" });
    };

    const groupedEntries = MEAL_TYPES.map((mt) => ({
        ...mt,
        entries: todayEntries.filter((e) => e.meal === mt.value),
    }));

    return (
        <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                <div>
                    <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>Calorie Tracker</div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>🔥 Today&apos;s Nutrition</h1>
                </div>
                <Link href="/food-scan">
                    <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        📸 Scan Food
                    </button>
                </Link>
            </div>

            {/* Calorie Ring */}
            <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                    {/* Ring Chart */}
                    <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
                        <svg viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
                            <circle
                                cx="70" cy="70" r="60"
                                fill="none" stroke="var(--secondary)" strokeWidth="10"
                            />
                            <circle
                                cx="70" cy="70" r="60"
                                fill="none"
                                stroke={isOverGoal ? "#ef4444" : "var(--primary)"}
                                strokeWidth="10"
                                strokeDasharray={`${calPercent * 3.77} 377`}
                                strokeLinecap="round"
                                style={{ transition: "stroke-dasharray 0.5s ease" }}
                            />
                        </svg>
                        <div style={{
                            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                        }}>
                            <div style={{ fontSize: 28, fontWeight: 900 }} className={isOverGoal ? "" : "gradient-text"}>
                                {totals.calories}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>/ {dailyGoal} kcal</div>
                        </div>
                    </div>

                    {/* Macro Bars */}
                    <div style={{ flex: 1 }}>
                        {[
                            { label: "Protein", value: totals.protein, goal: 140, unit: "g", color: "#e63946" },
                            { label: "Carbs", value: totals.carbs, goal: 250, unit: "g", color: "#7b2ff7" },
                            { label: "Fat", value: totals.fat, goal: 60, unit: "g", color: "#00b4d8" },
                        ].map((macro) => (
                            <div key={macro.label} style={{ marginBottom: 14 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                                    <span style={{ color: "var(--muted-foreground)" }}>{macro.label}</span>
                                    <span style={{ fontWeight: 700 }}>
                                        {macro.value}
                                        <span style={{ color: "var(--muted-foreground)", fontWeight: 400 }}>/{macro.goal}{macro.unit}</span>
                                    </span>
                                </div>
                                <div style={{ height: 6, borderRadius: 3, background: "var(--secondary)" }}>
                                    <div style={{
                                        height: 6, borderRadius: 3,
                                        width: `${Math.min((macro.value / macro.goal) * 100, 100)}%`,
                                        background: macro.color,
                                        transition: "width 0.5s",
                                    }} />
                                </div>
                            </div>
                        ))}
                        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 8 }}>
                            {dailyGoal - totals.calories > 0
                                ? `${dailyGoal - totals.calories} kcal remaining`
                                : `${totals.calories - dailyGoal} kcal over goal`}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Add + Action Buttons */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)} style={{ flex: 1 }}>
                    ➕ Add Food
                </button>
                <Link href="/food-scan" style={{ flex: 1 }}>
                    <button className="btn-outline" style={{ width: "100%" }}>📷 AI Food Scanner</button>
                </Link>
            </div>

            {/* Meal Type Selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {MEAL_TYPES.map((mt) => (
                    <button
                        key={mt.value}
                        onClick={() => setSelectedMeal(mt.value)}
                        style={{
                            flex: 1, padding: "10px 8px", borderRadius: 10, border: "none",
                            background: selectedMeal === mt.value ? "var(--theme-aura)" : "var(--secondary)",
                            color: selectedMeal === mt.value ? "var(--primary)" : "var(--muted-foreground)",
                            fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                        }}
                    >
                        {mt.label}
                    </button>
                ))}
            </div>

            {/* Add Food Form */}
            {showAddForm && (
                <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Add Food Entry</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                        {[
                            { key: "name", label: "Food", type: "text", value: form.name },
                            { key: "calories", label: "Calories", type: "number", value: form.calories },
                            { key: "protein", label: "Protein (g)", type: "number", value: form.protein },
                            { key: "carbs", label: "Carbs (g)", type: "number", value: form.carbs },
                            { key: "fat", label: "Fat (g)", type: "number", value: form.fat },
                        ].map((f) => (
                            <div key={f.key}>
                                <label style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4, display: "block" }}>
                                    {f.label}
                                </label>
                                <input
                                    type={f.type}
                                    value={f.value}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                                        }))
                                    }
                                    style={{
                                        width: "100%", padding: "8px 10px", borderRadius: 8,
                                        border: "1px solid var(--border)", background: "var(--secondary)",
                                        color: "var(--foreground)", fontSize: 13, fontFamily: "inherit", outline: "none",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <button className="btn-primary" onClick={handleAddManual} style={{ width: "100%" }}>
                        Add to {MEAL_TYPES.find((m) => m.value === selectedMeal)?.label || "Meal"}
                    </button>

                    {/* Quick Foods */}
                    <div style={{ marginTop: 20 }}>
                        <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 10, fontWeight: 600 }}>
                            ⚡ Quick Add
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {QUICK_FOODS.map((food, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleQuickAdd(food)}
                                    style={{
                                        padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)",
                                        background: "var(--card)", color: "var(--foreground)", fontSize: 12,
                                        cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                                    }}
                                >
                                    {food.name} <span style={{ color: "var(--primary)", fontWeight: 600 }}>{food.calories}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Food Log by Meal */}
            {groupedEntries.map((group) => (
                <div key={group.value} style={{ marginBottom: 20 }}>
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        marginBottom: 10, fontSize: 15, fontWeight: 700,
                    }}>
                        <span>{group.label}</span>
                        <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                            {group.entries.reduce((s, e) => s + e.calories, 0)} kcal
                        </span>
                    </div>
                    {group.entries.length === 0 ? (
                        <div style={{
                            padding: 16, borderRadius: 10, background: "var(--secondary)",
                            fontSize: 13, color: "var(--muted-foreground)", textAlign: "center",
                        }}>
                            No entries yet
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {group.entries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="glass-card"
                                    style={{
                                        padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 8,
                                            background: entry.source === "ai-scan" ? "rgba(34,197,94,0.15)" : "var(--theme-aura)",
                                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                                        }}>
                                            {entry.source === "ai-scan" ? "🤖" : "🍽️"}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 14 }}>{entry.name}</div>
                                            <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
                                                P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--primary)" }}>
                                            {entry.calories} kcal
                                        </span>
                                        <button
                                            onClick={() => removeEntry(entry.id)}
                                            style={{
                                                width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border)",
                                                background: "transparent", color: "var(--muted-foreground)",
                                                cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
