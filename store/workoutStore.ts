"use client";

import { create } from "zustand";

export interface ActiveExercise {
    name: string;
    sets: number;
    reps: string;
    restSeconds: number;
    currentSet: number;
    completed: boolean;
}

interface WorkoutState {
    isWorkoutActive: boolean;
    currentDay: string;
    exercises: ActiveExercise[];
    currentExerciseIndex: number;
    isResting: boolean;
    restTimeLeft: number;
    totalCaloriesBurned: number;
    hydrationReminders: number;
    startWorkout: (day: string, exercises: ActiveExercise[]) => void;
    completeSet: () => void;
    nextExercise: () => void;
    startRest: (seconds: number) => void;
    tickRest: () => void;
    endRest: () => void;
    addCalories: (cal: number) => void;
    endWorkout: () => void;
    addHydrationReminder: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
    isWorkoutActive: false,
    currentDay: "",
    exercises: [],
    currentExerciseIndex: 0,
    isResting: false,
    restTimeLeft: 0,
    totalCaloriesBurned: 0,
    hydrationReminders: 0,
    startWorkout: (day, exercises) =>
        set({
            isWorkoutActive: true,
            currentDay: day,
            exercises,
            currentExerciseIndex: 0,
            totalCaloriesBurned: 0,
        }),
    completeSet: () =>
        set((state) => {
            const exercises = [...state.exercises];
            const current = exercises[state.currentExerciseIndex];
            if (current) {
                current.currentSet += 1;
                if (current.currentSet >= current.sets) {
                    current.completed = true;
                }
            }
            return { exercises };
        }),
    nextExercise: () =>
        set((state) => ({
            currentExerciseIndex: Math.min(
                state.currentExerciseIndex + 1,
                state.exercises.length - 1
            ),
        })),
    startRest: (seconds) => set({ isResting: true, restTimeLeft: seconds }),
    tickRest: () =>
        set((state) => ({
            restTimeLeft: Math.max(0, state.restTimeLeft - 1),
            isResting: state.restTimeLeft > 1,
        })),
    endRest: () => set({ isResting: false, restTimeLeft: 0 }),
    addCalories: (cal) =>
        set((state) => ({
            totalCaloriesBurned: state.totalCaloriesBurned + cal,
        })),
    endWorkout: () =>
        set({
            isWorkoutActive: false,
            currentDay: "",
            exercises: [],
            currentExerciseIndex: 0,
            isResting: false,
            restTimeLeft: 0,
        }),
    addHydrationReminder: () =>
        set((state) => ({
            hydrationReminders: state.hydrationReminders + 1,
        })),
}));
