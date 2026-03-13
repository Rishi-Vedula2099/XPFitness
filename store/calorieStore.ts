"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FoodEntry {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    meal: string; // "breakfast" | "lunch" | "snack" | "dinner"
    timestamp: number;
    source: "manual" | "ai-scan";
    imageUrl?: string;
}

interface CalorieState {
    entries: FoodEntry[];
    dailyGoal: number;
    addEntry: (entry: Omit<FoodEntry, "id" | "timestamp">) => void;
    removeEntry: (id: string) => void;
    setDailyGoal: (goal: number) => void;
    getTodayEntries: () => FoodEntry[];
    getTodayTotals: () => { calories: number; protein: number; carbs: number; fat: number };
    clearToday: () => void;
}

function getTodayStart() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.getTime();
}

export const useCalorieStore = create<CalorieState>()(
    persist(
        (set, get) => ({
            entries: [],
            dailyGoal: 2200,
            addEntry: (entry) =>
                set((state) => ({
                    entries: [
                        ...state.entries,
                        { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
                    ],
                })),
            removeEntry: (id) =>
                set((state) => ({
                    entries: state.entries.filter((e) => e.id !== id),
                })),
            setDailyGoal: (goal) => set({ dailyGoal: goal }),
            getTodayEntries: () => {
                const start = getTodayStart();
                return get().entries.filter((e) => e.timestamp >= start);
            },
            getTodayTotals: () => {
                const start = getTodayStart();
                const today = get().entries.filter((e) => e.timestamp >= start);
                return {
                    calories: today.reduce((s, e) => s + e.calories, 0),
                    protein: today.reduce((s, e) => s + e.protein, 0),
                    carbs: today.reduce((s, e) => s + e.carbs, 0),
                    fat: today.reduce((s, e) => s + e.fat, 0),
                };
            },
            clearToday: () => {
                const start = getTodayStart();
                set((state) => ({
                    entries: state.entries.filter((e) => e.timestamp < start),
                }));
            },
        }),
        { name: "fitsaga-calories" }
    )
);
