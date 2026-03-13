"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme, THEME_CONFIGS } from "@/components/ThemeProvider";
import { useUserStore, type WorkoutTheme } from "@/store/userStore";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme, themeConfig } = useTheme();
    const level = useUserStore((s) => s.level);
    const xp = useUserStore((s) => s.xp);
    const [showThemePicker, setShowThemePicker] = useState(false);

    const navLinks = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/workout", label: "Workout" },
        { href: "/nutrition", label: "Nutrition" },
        { href: "/calories", label: "Calories" },
        { href: "/food-scan", label: "🤖 Scan" },
        { href: "/progress", label: "Progress" },
    ];

    return (
        <nav
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: "rgba(10, 10, 15, 0.85)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    padding: "0 24px",
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <span style={{ fontSize: 24 }}>{themeConfig.icon}</span>
                    <span
                        className="gradient-text"
                        style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}
                    >
                        FitSaga AI
                    </span>
                </Link>

                {/* Nav Links */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 8,
                                fontSize: 14,
                                fontWeight: 500,
                                textDecoration: "none",
                                color: pathname === link.href ? "var(--primary)" : "var(--muted-foreground)",
                                background: pathname === link.href ? "var(--theme-aura)" : "transparent",
                                transition: "all 0.2s",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* Level Badge */}
                    <div
                        style={{
                            background: "var(--theme-aura)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 20,
                            padding: "6px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        <span className="gradient-text">Lv.{level}</span>
                        <div style={{ width: 60, height: 4, background: "var(--secondary)", borderRadius: 2, overflow: "hidden" }}>
                            <div
                                style={{
                                    width: `${xp}%`,
                                    height: "100%",
                                    borderRadius: 2,
                                    background: `linear-gradient(90deg, var(--theme-gradient-from), var(--theme-gradient-to))`,
                                    transition: "width 0.5s",
                                }}
                            />
                        </div>
                    </div>

                    {/* Theme Picker Toggle */}
                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setShowThemePicker(!showThemePicker)}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                border: "2px solid var(--primary)",
                                background: "var(--theme-aura)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 18,
                                transition: "all 0.2s",
                            }}
                        >
                            {themeConfig.icon}
                        </button>
                        {showThemePicker && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 44,
                                    right: 0,
                                    background: "var(--card)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 12,
                                    padding: 8,
                                    minWidth: 200,
                                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                                }}
                            >
                                {(Object.keys(THEME_CONFIGS) as WorkoutTheme[]).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => {
                                            setTheme(t);
                                            setShowThemePicker(false);
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            width: "100%",
                                            padding: "10px 12px",
                                            border: "none",
                                            borderRadius: 8,
                                            background: theme === t ? "var(--theme-aura)" : "transparent",
                                            color: theme === t ? "var(--primary)" : "var(--foreground)",
                                            cursor: "pointer",
                                            fontSize: 14,
                                            fontWeight: 500,
                                            textAlign: "left",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        <span style={{ fontSize: 18 }}>{THEME_CONFIGS[t].icon}</span>
                                        <div>
                                            <div>{THEME_CONFIGS[t].label}</div>
                                            <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
                                                {THEME_CONFIGS[t].tagline}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
