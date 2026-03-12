"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { WORKOUT_DAYS, THEME_WORKOUT_LABELS, type ExerciseData } from "@/lib/exerciseData";
import { useTheme } from "@/components/ThemeProvider";
import { useUserStore } from "@/store/userStore";
import AnimatedExercise from "@/components/workout/AnimatedExercise";

function RestTimer({ seconds, onComplete }: { seconds: number; onComplete: () => void }) {
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        if (timeLeft <= 0) { onComplete(); return; }
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, onComplete]);

    const pct = ((seconds - timeLeft) / seconds) * 100;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                background: "rgba(0,0,0,0.85)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
            }}
        >
            <div style={{ fontSize: 14, color: "var(--muted-foreground)", fontWeight: 500 }}>REST TIME</div>
            <div className="gradient-text" style={{ fontSize: 72, fontWeight: 900 }}>
                {timeLeft}s
            </div>
            <div style={{ width: 200 }} className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${pct}%`, transition: "width 1s linear" }} />
            </div>
            <button className="btn-outline" onClick={onComplete} style={{ marginTop: 12 }}>
                Skip Rest
            </button>

            {/* Hydration reminder during rest */}
            <div
                style={{
                    marginTop: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 20px",
                    borderRadius: 12,
                    background: "rgba(0,180,216,0.08)",
                    border: "1px solid rgba(0,180,216,0.15)",
                }}
            >
                <span style={{ fontSize: 24 }}>💧</span>
                <span style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
                    Take a sip of water!
                </span>
            </div>
        </div>
    );
}

function ExerciseCard({
    exercise,
    index,
    isActive,
}: {
    exercise: ExerciseData;
    index: number;
    isActive: boolean;
}) {
    const [completedSets, setCompletedSets] = useState(0);
    const [showRest, setShowRest] = useState(false);
    const { addXP } = useUserStore();
    const isDone = completedSets >= exercise.sets;

    const handleCompleteSet = () => {
        if (isDone) return;
        setCompletedSets((c) => c + 1);
        addXP(5);
        if (completedSets + 1 < exercise.sets) {
            setShowRest(true);
        }
    };

    return (
        <>
            {showRest && (
                <RestTimer seconds={exercise.restSeconds} onComplete={() => setShowRest(false)} />
            )}
            <div
                className="glass-card"
                style={{
                    padding: 24,
                    opacity: isDone ? 0.5 : 1,
                    borderColor: isActive ? "var(--primary)" : undefined,
                    boxShadow: isActive ? "0 0 20px var(--theme-aura)" : undefined,
                }}
            >
                {/* Animated Exercise Demo */}
                <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                    <AnimatedExercise exerciseName={exercise.name} isPlaying={!isDone} />
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        background: isDone ? "rgba(34,197,94,0.15)" : "var(--theme-aura)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: isDone ? "#22c55e" : "var(--primary)",
                                    }}
                                >
                                    {isDone ? "✓" : index + 1}
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>{exercise.name}</h3>
                                    <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                                        {exercise.muscleGroup} • {exercise.equipment} • {exercise.difficulty}
                                    </p>
                                </div>
                            </div>
                            <div
                                style={{
                                    padding: "4px 10px",
                                    borderRadius: 6,
                                    background: "var(--secondary)",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "var(--primary)",
                                }}
                            >
                                {exercise.caloriesBurnPerSet * exercise.sets} cal
                            </div>
                        </div>

                        {/* Muscle Info */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                            {exercise.primaryMuscles.map((m, i) => (
                                <span
                                    key={i}
                                    style={{
                                        padding: "3px 8px",
                                        borderRadius: 4,
                                        background: "var(--theme-aura)",
                                        fontSize: 11,
                                        color: "var(--primary)",
                                        fontWeight: 600,
                                    }}
                                >
                                    {m}
                                </span>
                            ))}
                            {exercise.secondaryMuscles.map((m, i) => (
                                <span
                                    key={i}
                                    style={{
                                        padding: "3px 8px",
                                        borderRadius: 4,
                                        background: "var(--secondary)",
                                        fontSize: 11,
                                        color: "var(--muted-foreground)",
                                    }}
                                >
                                    {m}
                                </span>
                            ))}
                        </div>

                        {/* Sets / Reps / Rest */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                gap: 10,
                                marginBottom: 16,
                                textAlign: "center",
                            }}
                        >
                            <div style={{ padding: 10, borderRadius: 8, background: "var(--secondary)" }}>
                                <div style={{ fontSize: 18, fontWeight: 800 }}>{exercise.sets}</div>
                                <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Sets</div>
                            </div>
                            <div style={{ padding: 10, borderRadius: 8, background: "var(--secondary)" }}>
                                <div style={{ fontSize: 18, fontWeight: 800 }}>{exercise.reps}</div>
                                <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Reps</div>
                            </div>
                            <div style={{ padding: 10, borderRadius: 8, background: "var(--secondary)" }}>
                                <div style={{ fontSize: 18, fontWeight: 800 }}>{exercise.restSeconds}s</div>
                                <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Rest</div>
                            </div>
                        </div>

                        {/* Set Progress */}
                        <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                            {Array.from({ length: exercise.sets }).map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: 6,
                                        borderRadius: 3,
                                        background:
                                            i < completedSets
                                                ? "var(--primary)"
                                                : "var(--secondary)",
                                        transition: "background 0.3s",
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            className={isDone ? "btn-outline" : "btn-primary"}
                            onClick={handleCompleteSet}
                            disabled={isDone}
                            style={{ width: "100%", opacity: isDone ? 0.5 : 1 }}
                        >
                            {isDone
                                ? "✓ Completed"
                                : `Complete Set ${completedSets + 1}/${exercise.sets}`}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function WorkoutContent() {
    const searchParams = useSearchParams();
    const selectedDay = searchParams.get("day") || "day1";
    const { themeConfig } = useTheme();
    const { workoutTheme } = useUserStore();
    const themeLabels = THEME_WORKOUT_LABELS[workoutTheme] || THEME_WORKOUT_LABELS.saiyan;

    const dayData = WORKOUT_DAYS.find((d) => d.day === selectedDay) || WORKOUT_DAYS[0];

    return (
        <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>
                    {themeLabels.prefix} {themeLabels.suffix}
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
                    {themeConfig.icon} {dayData.label}
                </h1>
                <p style={{ color: "var(--muted-foreground)", fontSize: 14 }}>
                    {dayData.exercises.length} exercises • {dayData.muscleGroup} focus
                </p>
            </div>

            {/* Day Selector */}
            <div
                style={{
                    display: "flex",
                    gap: 8,
                    overflowX: "auto",
                    paddingBottom: 12,
                    marginBottom: 28,
                }}
            >
                {WORKOUT_DAYS.map((d) => (
                    <a
                        key={d.day}
                        href={`/workout?day=${d.day}`}
                        style={{
                            padding: "10px 18px",
                            borderRadius: 10,
                            background: d.day === selectedDay ? "var(--theme-aura)" : "var(--secondary)",
                            border: d.day === selectedDay ? "1px solid var(--primary)" : "1px solid transparent",
                            color: d.day === selectedDay ? "var(--primary)" : "var(--muted-foreground)",
                            fontSize: 13,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                            transition: "all 0.2s",
                        }}
                    >
                        {d.icon} {d.muscleGroup}
                    </a>
                ))}
            </div>

            {/* Exercise Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {dayData.exercises.map((ex, i) => (
                    <ExerciseCard
                        key={`${selectedDay}-${i}`}
                        exercise={ex}
                        index={i}
                        isActive={i === 0}
                    />
                ))}
            </div>
        </div>
    );
}
