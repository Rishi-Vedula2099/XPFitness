"use client";

import { useUserStore, type WorkoutTheme, type Goal, type DietType } from "@/store/userStore";
import { useTheme, THEME_CONFIGS } from "@/components/ThemeProvider";
import { useState } from "react";

export default function ProfilePage() {
    const {
        name, email, age, height, weight, workoutTheme,
        goal, dietType, level, xp, streak, setProfile,
    } = useUserStore();
    const { setTheme, themeConfig } = useTheme();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name, email, age, height, weight });

    const handleSave = () => {
        setProfile({
            name: form.name,
            email: form.email,
            age: form.age,
            height: form.height,
            weight: form.weight,
        });
        setEditing(false);
    };

    return (
        <div style={{ padding: "32px 24px", maxWidth: 700, margin: "0 auto" }}>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>👤 Profile</h1>
                <p style={{ color: "var(--muted-foreground)", fontSize: 14 }}>
                    Manage your body metrics, training preferences, and account settings.
                </p>
            </div>

            {/* Avatar & Level */}
            <div className="glass-card" style={{ padding: 28, marginBottom: 24, textAlign: "center" }}>
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, var(--theme-gradient-from), var(--theme-gradient-to))`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 36,
                        margin: "0 auto 16px",
                        boxShadow: "0 0 30px var(--theme-aura)",
                    }}
                >
                    {themeConfig.icon}
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{name || "Warrior"}</h2>
                <p className="gradient-text" style={{ fontSize: 14, fontWeight: 600 }}>
                    Level {level} • {xp}% XP
                </p>
            </div>

            {/* Body Metrics Form */}
            <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700 }}>Body Metrics</h3>
                    <button
                        className="btn-outline"
                        onClick={() => editing ? handleSave() : setEditing(true)}
                        style={{ padding: "8px 16px", fontSize: 13 }}
                    >
                        {editing ? "💾 Save" : "✏️ Edit"}
                    </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[
                        { label: "Name", key: "name", type: "text", value: form.name },
                        { label: "Email", key: "email", type: "email", value: form.email },
                        { label: "Age", key: "age", type: "number", value: form.age },
                        { label: "Height (cm)", key: "height", type: "number", value: form.height },
                        { label: "Weight (kg)", key: "weight", type: "number", value: form.weight },
                    ].map((field) => (
                        <div key={field.key}>
                            <label style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 6, display: "block" }}>
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                value={field.value}
                                disabled={!editing}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                                    }))
                                }
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: editing ? "var(--secondary)" : "var(--card)",
                                    color: "var(--foreground)",
                                    fontSize: 14,
                                    outline: "none",
                                    transition: "all 0.2s",
                                    fontFamily: "inherit",
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Training Theme Picker */}
            <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Training Theme</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                    {(Object.keys(THEME_CONFIGS) as WorkoutTheme[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => { setTheme(t); setProfile({ workoutTheme: t }); }}
                            style={{
                                padding: 16,
                                borderRadius: 12,
                                border: workoutTheme === t ? `2px solid ${THEME_CONFIGS[t].colors.primary}` : "1px solid var(--border)",
                                background: workoutTheme === t ? "var(--theme-aura)" : "var(--card)",
                                cursor: "pointer",
                                textAlign: "left",
                                transition: "all 0.2s",
                            }}
                        >
                            <span style={{ fontSize: 24 }}>{THEME_CONFIGS[t].icon}</span>
                            <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8, color: THEME_CONFIGS[t].colors.primary }}>
                                {THEME_CONFIGS[t].label}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{THEME_CONFIGS[t].tagline}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Goal */}
            <div className="glass-card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Fitness Goal</h3>
                <div style={{ display: "flex", gap: 12 }}>
                    {(["muscle_gain", "fat_loss", "endurance"] as Goal[]).map((g) => (
                        <button
                            key={g}
                            onClick={() => setProfile({ goal: g })}
                            style={{
                                flex: 1,
                                padding: "14px 12px",
                                borderRadius: 10,
                                border: goal === g ? "1px solid var(--primary)" : "1px solid var(--border)",
                                background: goal === g ? "var(--theme-aura)" : "var(--card)",
                                color: goal === g ? "var(--primary)" : "var(--foreground)",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                        >
                            {g === "muscle_gain" ? "💪 Muscle" : g === "fat_loss" ? "🔥 Fat Loss" : "🏃 Endurance"}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
