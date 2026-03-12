"use client";

import { useState, useRef, useCallback } from "react";
import { useCalorieStore } from "@/store/calorieStore";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

interface FoodItem {
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
}

interface AnalysisResult {
    foods: FoodItem[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    mealType: string;
    healthScore: number;
    healthNotes: string;
    suggestions: string[];
}

export default function FoodScanPage() {
    const { themeConfig } = useTheme();
    const { addEntry } = useCalorieStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [addedToTracker, setAddedToTracker] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback((file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }
        setImageFile(file);
        setResult(null);
        setError(null);
        setAddedToTracker(false);

        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleAnalyze = async () => {
        if (!imageFile) return;
        setAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("image", imageFile);

            const res = await fetch("/api/food-scan", { method: "POST", body: formData });
            const data = await res.json();

            if (data.success || data.analysis) {
                setResult(data.analysis);
            } else {
                setError(data.error || "Failed to analyze image");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleAddToTracker = () => {
        if (!result) return;
        result.foods.forEach((food) => {
            addEntry({
                name: food.name,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fat: food.fat,
                meal: result.mealType || "lunch",
                source: "ai-scan",
            });
        });
        setAddedToTracker(true);
    };

    const healthColor =
        result && result.healthScore >= 7 ? "#22c55e" : result && result.healthScore >= 4 ? "#eab308" : "#ef4444";

    return (
        <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                <div>
                    <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>AI Food Recognition</div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>📸 Food Scanner</h1>
                    <p style={{ color: "var(--muted-foreground)", fontSize: 14 }}>
                        Upload a photo of your meal to instantly analyze its nutritional value.
                    </p>
                </div>
                <Link href="/calories">
                    <button className="btn-outline">📊 Calorie Log</button>
                </Link>
            </div>

            {/* Upload Area */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="glass-card"
                style={{
                    padding: imagePreview ? 0 : 60,
                    marginBottom: 24,
                    textAlign: "center",
                    cursor: "pointer",
                    borderColor: isDragging ? "var(--primary)" : undefined,
                    boxShadow: isDragging ? "0 0 30px var(--theme-aura)" : undefined,
                    overflow: "hidden",
                    position: "relative",
                    minHeight: imagePreview ? 300 : undefined,
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    style={{ display: "none" }}
                />

                {imagePreview ? (
                    <div style={{ position: "relative" }}>
                        <img
                            src={imagePreview}
                            alt="Food preview"
                            style={{
                                width: "100%",
                                maxHeight: 400,
                                objectFit: "cover",
                                borderRadius: 12,
                            }}
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setImagePreview(null);
                                setImageFile(null);
                                setResult(null);
                            }}
                            style={{
                                position: "absolute", top: 12, right: 12,
                                width: 36, height: 36, borderRadius: "50%",
                                background: "rgba(0,0,0,0.7)", border: "none",
                                color: "white", fontSize: 18, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>📷</div>
                        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                            Drop your food photo here
                        </div>
                        <div style={{ fontSize: 14, color: "var(--muted-foreground)", marginBottom: 16 }}>
                            or click to browse • Supports JPG, PNG, WebP
                        </div>
                        <div
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "10px 20px", borderRadius: 10,
                                background: "var(--theme-aura)", fontSize: 13,
                                color: "var(--primary)", fontWeight: 600,
                            }}
                        >
                            📱 Camera or Gallery
                        </div>
                    </>
                )}
            </div>

            {/* Analyze Button */}
            {imageFile && !result && (
                <button
                    className="btn-primary"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    style={{
                        width: "100%", marginBottom: 24, fontSize: 16, padding: "16px 24px",
                        opacity: analyzing ? 0.7 : 1,
                    }}
                >
                    {analyzing ? (
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                            <span className="aura-pulse">🔍</span> Analyzing with AI...
                        </span>
                    ) : (
                        "🤖 Analyze Nutrition"
                    )}
                </button>
            )}

            {/* Error */}
            {error && (
                <div className="glass-card" style={{ padding: 20, marginBottom: 24, borderColor: "#ef4444" }}>
                    <p style={{ color: "#ef4444", fontSize: 14 }}>⚠️ {error}</p>
                </div>
            )}

            {/* Analysis Results */}
            {result && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Health Score */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>🧠 Nutrition Report</h2>
                            <div style={{
                                width: 48, height: 48, borderRadius: "50%",
                                background: `${healthColor}20`, display: "flex",
                                alignItems: "center", justifyContent: "center",
                                fontSize: 20, fontWeight: 900, color: healthColor,
                                border: `2px solid ${healthColor}`,
                            }}>
                                {result.healthScore}
                            </div>
                        </div>
                        <p style={{ color: "var(--muted-foreground)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                            {result.healthNotes}
                        </p>

                        {/* Macro Summary */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                            {[
                                { label: "Calories", value: result.totalCalories, unit: "kcal", color: "#ff6b00" },
                                { label: "Protein", value: result.totalProtein, unit: "g", color: "#e63946" },
                                { label: "Carbs", value: result.totalCarbs, unit: "g", color: "#7b2ff7" },
                                { label: "Fat", value: result.totalFat, unit: "g", color: "#00b4d8" },
                            ].map((m, i) => (
                                <div key={i} className="stat-card" style={{ textAlign: "center", padding: 16 }}>
                                    <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4 }}>{m.label}</div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.value}</div>
                                    <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{m.unit}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Individual Foods */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🍽️ Detected Foods</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {result.foods.map((food, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: 16, borderRadius: 10, background: "var(--secondary)",
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{food.name}</div>
                                        <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                                            {food.portion} • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                                            {food.fiber > 0 && ` • Fiber: ${food.fiber}g`}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 800, fontSize: 16, color: "var(--primary)" }}>
                                        {food.calories}
                                        <span style={{ fontSize: 11, fontWeight: 400, color: "var(--muted-foreground)" }}> kcal</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggestions */}
                    {result.suggestions && result.suggestions.length > 0 && (
                        <div className="glass-card" style={{ padding: 24 }}>
                            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>💡 Suggestions</h3>
                            {result.suggestions.map((s, i) => (
                                <div key={i} style={{
                                    display: "flex", gap: 10, marginBottom: 8,
                                    fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.5,
                                }}>
                                    <span style={{ color: "var(--primary)" }}>•</span>
                                    <span>{s}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add to Calorie Tracker */}
                    <button
                        className={addedToTracker ? "btn-outline" : "btn-primary"}
                        onClick={handleAddToTracker}
                        disabled={addedToTracker}
                        style={{ width: "100%", fontSize: 16, padding: "16px 24px" }}
                    >
                        {addedToTracker ? "✓ Added to Calorie Tracker" : "📊 Add to Calorie Tracker"}
                    </button>

                    {addedToTracker && (
                        <Link href="/calories">
                            <button className="btn-outline" style={{ width: "100%", marginTop: 8 }}>
                                View Calorie Log →
                            </button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
