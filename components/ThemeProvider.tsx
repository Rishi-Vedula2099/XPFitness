"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUserStore, type WorkoutTheme } from "@/store/userStore";

interface ThemeContextType {
    theme: WorkoutTheme;
    setTheme: (theme: WorkoutTheme) => void;
    themeConfig: ThemeConfig;
}

interface ThemeConfig {
    name: string;
    label: string;
    icon: string;
    tagline: string;
    style: string;
    colors: { primary: string; secondary: string; glow: string };
}

const THEME_CONFIGS: Record<WorkoutTheme, ThemeConfig> = {
    saiyan: {
        name: "saiyan",
        label: "Saiyan Mode",
        icon: "⚡",
        tagline: "High intensity strength training",
        style: "Power & Destruction",
        colors: { primary: "#ff6b00", secondary: "#ffd700", glow: "#ff6b00" },
    },
    shinobi: {
        name: "shinobi",
        label: "Shinobi Mode",
        icon: "🌀",
        tagline: "Agility, speed, bodyweight",
        style: "Shadow & Precision",
        colors: { primary: "#e63946", secondary: "#ff006e", glow: "#e63946" },
    },
    hunter: {
        name: "hunter",
        label: "Hunter Mode",
        icon: "🔮",
        tagline: "Progressive leveling workouts",
        style: "Level & Evolve",
        colors: { primary: "#7b2ff7", secondary: "#c77dff", glow: "#7b2ff7" },
    },
    sorcerer: {
        name: "sorcerer",
        label: "Sorcerer Mode",
        icon: "💠",
        tagline: "Balance, flexibility, endurance",
        style: "Cursed Energy Control",
        colors: { primary: "#00b4d8", secondary: "#48cae4", glow: "#00b4d8" },
    },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const workoutTheme = useUserStore((s) => s.workoutTheme);
    const setStoreTheme = useUserStore((s) => s.setTheme);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute("data-theme", workoutTheme);
        }
    }, [workoutTheme, mounted]);

    const setTheme = (theme: WorkoutTheme) => {
        setStoreTheme(theme);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme: workoutTheme,
                setTheme,
                themeConfig: THEME_CONFIGS[workoutTheme],
            }}
        >
            {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
}

export { THEME_CONFIGS };
