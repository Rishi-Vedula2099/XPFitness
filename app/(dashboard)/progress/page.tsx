"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";

// Simulated weekly progress data
const MOCK_WEEKLY = [
    { day: "Mon", calories: 320, exercises: 5, completed: true },
    { day: "Tue", calories: 280, exercises: 4, completed: true },
    { day: "Wed", calories: 0, exercises: 0, completed: false },
    { day: "Thu", calories: 350, exercises: 6, completed: true },
    { day: "Fri", calories: 290, exercises: 5, completed: true },
    { day: "Sat", calories: 400, exercises: 7, completed: true },
    { day: "Sun", calories: 0, exercises: 0, completed: false },
];

const maxCal = Math.max(...MOCK_WEEKLY.map((d) => d.calories), 1);

function getLevelTitle(level: number): string {
    if (level >= 100) return "Mythic";
    if (level >= 75) return "Legend";
    if (level >= 50) return "Elite Warrior";
    if (level >= 35) return "Warrior";
    if (level >= 25) return "Hunter";
    if (level >= 15) return "Fighter";
    if (level >= 10) return "Shinobi";
    if (level >= 5) return "Trainee";
    return "Beginner";
}

export default function ProgressPage() {
    const { themeConfig } = useTheme();
    const { level, xp, streak, workoutTheme } = useUserStore();
    const [activeTab, setActiveTab] = useState<"week" | "body">("week");

    const totalCalWeek = MOCK_WEEKLY.reduce((s, d) => s + d.calories, 0);
    const totalExercisesWeek = MOCK_WEEKLY.reduce((s, d) => s + d.exercises, 0);
    const daysActive = MOCK_WEEKLY.filter((d) => d.completed).length;

    return (
        <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>
                    Progress Tracking
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
                    📈 Your Journey
                </h1>
            </div>

            {/* Level Progress */}
            <div
                className="glass-card"
                style={{
                    padding: 28,
                    marginBottom: 24,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    className="aura-pulse"
                    style={{
                        position: "absolute",
                        top: -30,
                        right: -30,
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, var(--theme-aura), transparent)`,
                        pointerEvents: "none",
                    }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div>
                        <div style={{ fontSize: 14, color: "var(--muted-foreground)", marginBottom: 4 }}>Current Rank</div>
                        <div style={{ fontSize: 26, fontWeight: 800 }}>
                            {themeConfig.icon}{" "}
                            <span className="gradient-text">{getLevelTitle(level)}</span>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 36, fontWeight: 900 }} className="gradient-text">
                            Lv.{level}
                        </div>
                    </div>
                </div>
                <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted-foreground)" }}>
                    <span>XP: {xp}/100</span>
                    <span>Next: {getLevelTitle(level + 5)}</span>
                </div>
                <div className="progress-bar" style={{ height: 12, borderRadius: 6 }}>
                    <div className="progress-bar-fill" style={{ width: `${xp}%`, height: 12, borderRadius: 6 }} />
                </div>
            </div>

            {/* Quick Stats */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 12,
                    marginBottom: 28,
                }}
            >
                {[
                    { label: "Streak", value: `${streak}`, icon: "🔥", unit: "days" },
                    { label: "This Week", value: `${totalCalWeek}`, icon: "⚡", unit: "cal" },
                    { label: "Exercises", value: `${totalExercisesWeek}`, icon: "💪", unit: "done" },
                    { label: "Active Days", value: `${daysActive}/7`, icon: "📅", unit: "days" },
                ].map((s, i) => (
                    <div key={i} className="stat-card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                        <div style={{ fontSize: 22, fontWeight: 800 }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Weekly Chart */}
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>📊 Weekly Overview</h2>
            <div className="glass-card" style={{ padding: 24, marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180 }}>
                    {MOCK_WEEKLY.map((d, i) => (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)" }}>
                                {d.calories > 0 ? `${d.calories}` : "—"}
                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    maxWidth: 40,
                                    height: `${(d.calories / maxCal) * 120}px`,
                                    minHeight: 4,
                                    borderRadius: 6,
                                    background: d.completed
                                        ? `linear-gradient(180deg, var(--theme-gradient-from), var(--theme-gradient-to))`
                                        : "var(--secondary)",
                                    transition: "height 0.5s ease",
                                }}
                            />
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: d.completed ? "var(--foreground)" : "var(--muted-foreground)",
                                }}
                            >
                                {d.day}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Streak Visualization */}
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>🔥 Streak Tracker</h2>
            <div className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {Array.from({ length: 30 }).map((_, i) => {
                        const isActive = i < streak;
                        return (
                            <div
                                key={i}
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 6,
                                    background: isActive
                                        ? `linear-gradient(135deg, var(--theme-gradient-from), var(--theme-gradient-to))`
                                        : "var(--secondary)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: isActive ? "white" : "var(--muted-foreground)",
                                    transition: "all 0.3s",
                                }}
                            >
                                {i + 1}
                            </div>
                        );
                    })}
                </div>
                <div style={{ marginTop: 16, fontSize: 13, color: "var(--muted-foreground)" }}>
                    Current streak: <span style={{ color: "var(--primary)", fontWeight: 700 }}>{streak} days</span> — Keep pushing!
                </div>
            </div>
        </div>
    );
}
