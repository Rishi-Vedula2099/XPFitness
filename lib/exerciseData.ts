export interface ExerciseData {
    name: string;
    muscleGroup: string;
    primaryMuscles: string[];
    secondaryMuscles: string[];
    sets: number;
    reps: string;
    restSeconds: number;
    difficulty: string;
    equipment: string;
    caloriesBurnPerSet: number;
}

export interface WorkoutDay {
    day: string;
    label: string;
    muscleGroup: string;
    icon: string;
    exercises: ExerciseData[];
}

export const WORKOUT_DAYS: WorkoutDay[] = [
    {
        day: "day1",
        label: "Day 1 — Chest + Triceps",
        muscleGroup: "Chest",
        icon: "💪",
        exercises: [
            { name: "Push Up", muscleGroup: "Chest", primaryMuscles: ["Pectoralis Major"], secondaryMuscles: ["Triceps", "Anterior Deltoid", "Core"], sets: 4, reps: "12-15", restSeconds: 60, difficulty: "Beginner", equipment: "Bodyweight", caloriesBurnPerSet: 8 },
            { name: "Barbell Bench Press", muscleGroup: "Chest", primaryMuscles: ["Pectoralis Major"], secondaryMuscles: ["Triceps", "Shoulders"], sets: 4, reps: "8-10", restSeconds: 90, difficulty: "Intermediate", equipment: "Barbell", caloriesBurnPerSet: 12 },
            { name: "Incline Dumbbell Press", muscleGroup: "Upper Chest", primaryMuscles: ["Upper Pectoralis"], secondaryMuscles: ["Shoulders", "Triceps"], sets: 3, reps: "10-12", restSeconds: 75, difficulty: "Intermediate", equipment: "Dumbbells", caloriesBurnPerSet: 10 },
            { name: "Chest Dips", muscleGroup: "Lower Chest", primaryMuscles: ["Lower Pectoralis"], secondaryMuscles: ["Triceps"], sets: 3, reps: "8-12", restSeconds: 90, difficulty: "Intermediate", equipment: "Dip Station", caloriesBurnPerSet: 11 },
            { name: "Cable Fly", muscleGroup: "Chest", primaryMuscles: ["Pectoralis Major"], secondaryMuscles: ["Front Deltoid"], sets: 3, reps: "12-15", restSeconds: 60, difficulty: "Beginner", equipment: "Cable Machine", caloriesBurnPerSet: 7 },
        ],
    },
    {
        day: "day2",
        label: "Day 2 — Back + Biceps",
        muscleGroup: "Back",
        icon: "🔥",
        exercises: [
            { name: "Pull Ups", muscleGroup: "Back", primaryMuscles: ["Latissimus Dorsi"], secondaryMuscles: ["Biceps", "Core"], sets: 4, reps: "6-10", restSeconds: 90, difficulty: "Intermediate", equipment: "Pull-Up Bar", caloriesBurnPerSet: 10 },
            { name: "Lat Pulldown", muscleGroup: "Back", primaryMuscles: ["Latissimus Dorsi"], secondaryMuscles: ["Biceps"], sets: 3, reps: "10-12", restSeconds: 75, difficulty: "Beginner", equipment: "Cable Machine", caloriesBurnPerSet: 8 },
            { name: "Barbell Bent Row", muscleGroup: "Back", primaryMuscles: ["Upper Back"], secondaryMuscles: ["Biceps", "Rear Delts"], sets: 4, reps: "8-10", restSeconds: 90, difficulty: "Intermediate", equipment: "Barbell", caloriesBurnPerSet: 11 },
            { name: "Seated Cable Row", muscleGroup: "Back", primaryMuscles: ["Middle Back"], secondaryMuscles: ["Biceps"], sets: 3, reps: "12", restSeconds: 75, difficulty: "Beginner", equipment: "Cable Machine", caloriesBurnPerSet: 8 },
        ],
    },
    {
        day: "day3",
        label: "Day 3 — Legs",
        muscleGroup: "Legs",
        icon: "🦵",
        exercises: [
            { name: "Barbell Squat", muscleGroup: "Legs", primaryMuscles: ["Quadriceps"], secondaryMuscles: ["Glutes", "Hamstrings"], sets: 4, reps: "6-8", restSeconds: 120, difficulty: "Intermediate", equipment: "Barbell", caloriesBurnPerSet: 15 },
            { name: "Walking Lunges", muscleGroup: "Legs", primaryMuscles: ["Quadriceps"], secondaryMuscles: ["Glutes"], sets: 3, reps: "12 each leg", restSeconds: 90, difficulty: "Beginner", equipment: "Bodyweight", caloriesBurnPerSet: 10 },
            { name: "Leg Press", muscleGroup: "Legs", primaryMuscles: ["Quadriceps"], secondaryMuscles: ["Glutes"], sets: 3, reps: "10-12", restSeconds: 90, difficulty: "Beginner", equipment: "Leg Press Machine", caloriesBurnPerSet: 12 },
            { name: "Romanian Deadlift", muscleGroup: "Legs", primaryMuscles: ["Hamstrings"], secondaryMuscles: ["Glutes"], sets: 3, reps: "8-10", restSeconds: 90, difficulty: "Intermediate", equipment: "Barbell", caloriesBurnPerSet: 13 },
        ],
    },
    {
        day: "day4",
        label: "Day 4 — Shoulders",
        muscleGroup: "Shoulders",
        icon: "🎯",
        exercises: [
            { name: "Dumbbell Shoulder Press", muscleGroup: "Shoulders", primaryMuscles: ["Deltoids"], secondaryMuscles: ["Triceps"], sets: 4, reps: "8-10", restSeconds: 90, difficulty: "Intermediate", equipment: "Dumbbells", caloriesBurnPerSet: 10 },
            { name: "Lateral Raise", muscleGroup: "Shoulders", primaryMuscles: ["Side Delts"], secondaryMuscles: ["Traps"], sets: 3, reps: "12-15", restSeconds: 60, difficulty: "Beginner", equipment: "Dumbbells", caloriesBurnPerSet: 6 },
            { name: "Arnold Press", muscleGroup: "Shoulders", primaryMuscles: ["Deltoids"], secondaryMuscles: ["Upper Chest"], sets: 3, reps: "10-12", restSeconds: 75, difficulty: "Intermediate", equipment: "Dumbbells", caloriesBurnPerSet: 9 },
            { name: "Rear Delt Fly", muscleGroup: "Shoulders", primaryMuscles: ["Rear Delts"], secondaryMuscles: ["Upper Back"], sets: 3, reps: "12-15", restSeconds: 60, difficulty: "Beginner", equipment: "Dumbbells", caloriesBurnPerSet: 6 },
        ],
    },
    {
        day: "day5",
        label: "Day 5 — Arms",
        muscleGroup: "Arms",
        icon: "💥",
        exercises: [
            { name: "Dumbbell Curl", muscleGroup: "Arms", primaryMuscles: ["Biceps"], secondaryMuscles: ["Forearms"], sets: 3, reps: "10-12", restSeconds: 60, difficulty: "Beginner", equipment: "Dumbbells", caloriesBurnPerSet: 6 },
            { name: "Hammer Curl", muscleGroup: "Arms", primaryMuscles: ["Biceps"], secondaryMuscles: ["Forearms"], sets: 3, reps: "10-12", restSeconds: 60, difficulty: "Beginner", equipment: "Dumbbells", caloriesBurnPerSet: 6 },
            { name: "Tricep Pushdown", muscleGroup: "Arms", primaryMuscles: ["Triceps"], secondaryMuscles: ["Forearms"], sets: 3, reps: "12", restSeconds: 60, difficulty: "Beginner", equipment: "Cable Machine", caloriesBurnPerSet: 7 },
            { name: "Overhead Tricep Extension", muscleGroup: "Arms", primaryMuscles: ["Triceps"], secondaryMuscles: [], sets: 3, reps: "10-12", restSeconds: 60, difficulty: "Beginner", equipment: "Dumbbell", caloriesBurnPerSet: 7 },
        ],
    },
    {
        day: "day6",
        label: "Day 6 — Core",
        muscleGroup: "Core",
        icon: "🧘",
        exercises: [
            { name: "Plank", muscleGroup: "Core", primaryMuscles: ["Core"], secondaryMuscles: ["Shoulders"], sets: 3, reps: "45 sec", restSeconds: 45, difficulty: "Beginner", equipment: "Bodyweight", caloriesBurnPerSet: 5 },
            { name: "Bicycle Crunch", muscleGroup: "Core", primaryMuscles: ["Abs"], secondaryMuscles: ["Obliques"], sets: 3, reps: "20", restSeconds: 45, difficulty: "Beginner", equipment: "Bodyweight", caloriesBurnPerSet: 6 },
            { name: "Hanging Leg Raise", muscleGroup: "Core", primaryMuscles: ["Lower Abs"], secondaryMuscles: [], sets: 3, reps: "12", restSeconds: 60, difficulty: "Intermediate", equipment: "Pull-Up Bar", caloriesBurnPerSet: 7 },
            { name: "Russian Twist", muscleGroup: "Core", primaryMuscles: ["Obliques"], secondaryMuscles: [], sets: 3, reps: "20", restSeconds: 45, difficulty: "Beginner", equipment: "Bodyweight", caloriesBurnPerSet: 6 },
        ],
    },
];

export const THEME_WORKOUT_LABELS: Record<string, { prefix: string; suffix: string }> = {
    saiyan: { prefix: "Saiyan", suffix: "Power Training" },
    shinobi: { prefix: "Shinobi", suffix: "Shadow Drill" },
    hunter: { prefix: "Hunter", suffix: "Level Up" },
    sorcerer: { prefix: "Sorcerer", suffix: "Cursed Technique" },
};
