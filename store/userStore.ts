"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WorkoutTheme = "saiyan" | "shinobi" | "hunter" | "sorcerer";
export type Goal = "muscle_gain" | "fat_loss" | "endurance";
export type DietType = "vegetarian" | "non-vegetarian";

interface UserState {
    name: string;
    email: string;
    age: number;
    height: number;
    weight: number;
    workoutTheme: WorkoutTheme;
    goal: Goal;
    dietType: DietType;
    level: number;
    xp: number;
    streak: number;
    setProfile: (profile: Partial<UserState>) => void;
    setTheme: (theme: WorkoutTheme) => void;
    addXP: (amount: number) => void;
    incrementStreak: () => void;
    resetStreak: () => void;
}

const XP_PER_LEVEL = 100;

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            name: "",
            email: "",
            age: 25,
            height: 175,
            weight: 70,
            workoutTheme: "saiyan",
            goal: "muscle_gain",
            dietType: "vegetarian",
            level: 1,
            xp: 0,
            streak: 0,
            setProfile: (profile) => set((state) => ({ ...state, ...profile })),
            setTheme: (theme) => set({ workoutTheme: theme }),
            addXP: (amount) =>
                set((state) => {
                    const newXP = state.xp + amount;
                    const levelsGained = Math.floor(newXP / XP_PER_LEVEL);
                    return {
                        xp: newXP % XP_PER_LEVEL,
                        level: state.level + levelsGained,
                    };
                }),
            incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
            resetStreak: () => set({ streak: 0 }),
        }),
        { name: "fitsaga-user" }
    )
);
