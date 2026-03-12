"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useUserStore } from "@/store/userStore";
import { WORKOUT_DAYS, THEME_WORKOUT_LABELS } from "@/lib/exerciseData";
import Link from "next/link";

const LEVEL_TITLES: Record<string, string> = {
    "1": "Beginner",
    "5": "Trainee",
    "10": "Shinobi",
    "15": "Fighter",
    "25": "Hunter",
    "35": "Warrior",
    "50": "Elite Warrior",
    "75": "Legend",
    "100": "Mythic",
};

function getLevelTitle(level: number): string {
    const thresholds = Object.keys(LEVEL_TITLES)
        .map(Number)
        .sort((a, b) => b - a);
    for (const t of thresholds) {
        if (level >= t) return LEVEL_TITLES[String(t)];
    }
    return "Beginner";
}

export default function DashboardPage() {
    const { themeConfig } = useTheme();
    const { name, level, xp, streak, workoutTheme, goal, weight, height, age } = useUserStore();
    const themeLabels = THEME_WORKOUT_LABELS[workoutTheme] || THEME_WORKOUT_LABELS.saiyan;

    const stats = [
        { label: "Level", value: `Lv. ${level}`, sub: getLevelTitle(level), icon: "⚔️" },
        { label: "XP", value: `${xp}/100`, sub: "Next level", icon: "✨" },
        { label: "Streak", value: `${streak} days`, sub: "Keep going!", icon: "🔥" },
        { label: "Training", value: themeConfig.label, sub: themeLabels.suffix, icon: themeConfig.icon },
    ];

    return (
        <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
            {/* Welcome Banner */}
            <div
                className="glass-card"
                style={{
                    padding: 32,
                    marginBottom: 28,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    className="aura-pulse"
                    style={{
                        position: "absolute",
                        top: -40,
                        right: -40,
                        width: 200,
                        height: 200,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, var(--theme-aura), transparent)`,
                        pointerEvents: "none",
                    }}
                />
                <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 8 }}>
                    Welcome back, warrior
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
                    {name || "Warrior"}{" "}
                    <span className="gradient-text" style={{ fontSize: 20 }}>
                        — {getLevelTitle(level)}
                    </span>
                </h1>
                <p style={{ color: "var(--muted-foreground)", fontSize: 15 }}>
                    {themeLabels.prefix} {themeLabels.suffix} • Goal:{" "}
                    <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                        {goal?.replace("_", " ").toUpperCase() || "MUSCLE GAIN"}
                    </span>
                </p>

                {/* XP Progress Bar */}
                <div style={{ marginTop: 20, maxWidth: 400 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted-foreground)", marginBottom: 6 }}>
                        <span>Level {level}</span>
                        <span>{xp}% to Level {level + 1}</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${xp}%` }} />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                    marginBottom: 32,
                }}
            >
                {stats.map((s, i) => (
                    <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <span style={{ fontSize: 24 }}>{s.icon}</span>
                            <span style={{ fontSize: 13, color: "var(--muted-foreground)", fontWeight: 500 }}>{s.label}</span>
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800 }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 4 }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Today's Workout Plan */}
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
                {themeConfig.icon} Today&apos;s Training
            </h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: 16,
                    marginBottom: 32,
                }}
            >
                {WORKOUT_DAYS.map((day) => (
                    <Link
                        href={`/workout?day=${day.day}`}
                        key={day.day}
                        style={{ textDecoration: "none" }}
                    >
                        <div className="glass-card" style={{ padding: 24, cursor: "pointer" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                <span style={{ fontSize: 28 }}>{day.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 16 }}>{day.label}</div>
                                    <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                                        {day.exercises.length} exercises • {day.muscleGroup}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {day.exercises.slice(0, 3).map((ex, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            padding: "4px 10px",
                                            borderRadius: 6,
                                            background: "var(--secondary)",
                                            fontSize: 11,
                                            color: "var(--muted-foreground)",
                                        }}
                                    >
                                        {ex.name}
                                    </span>
                                ))}
                                {day.exercises.length > 3 && (
                                    <span style={{ fontSize: 11, color: "var(--muted-foreground)", padding: "4px 0" }}>
                                        +{day.exercises.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Hydration Reminder */}
            <div
                className="glass-card"
                style={{
                    padding: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    background: "rgba(0, 180, 216, 0.06)",
                    borderColor: "rgba(0, 180, 216, 0.15)",
                }}
            >
                <span style={{ fontSize: 36 }}>💧</span>
                <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Stay Hydrated</h3>
                    <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
                        Drink at least 3–4 liters of water today. Hydration directly impacts your workout performance.
                    </p>
                </div>
            </div>
        </div>
    );
}
