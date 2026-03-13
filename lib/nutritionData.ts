export interface NutritionPlan {
    goal: string;
    dietType: string;
    dailyCalories: number;
    protein: string;
    carbs: string;
    fat: string;
    meals: { meal: string; foods: string[] }[];
}

export const NUTRITION_PLANS: NutritionPlan[] = [
    {
        goal: "muscle_gain",
        dietType: "vegetarian",
        dailyCalories: 2200,
        protein: "140g",
        carbs: "250g",
        fat: "60g",
        meals: [
            { meal: "Breakfast", foods: ["Oats + Milk", "Banana", "Peanut Butter"] },
            { meal: "Lunch", foods: ["Brown Rice", "Paneer Curry", "Dal"] },
            { meal: "Snack", foods: ["Greek Yogurt", "Mixed Nuts"] },
            { meal: "Dinner", foods: ["Chapati", "Soybean / Paneer", "Mixed Vegetables"] },
        ],
    },
    {
        goal: "muscle_gain",
        dietType: "non-vegetarian",
        dailyCalories: 2500,
        protein: "160g",
        carbs: "280g",
        fat: "70g",
        meals: [
            { meal: "Breakfast", foods: ["Eggs (4)", "Whole Wheat Toast", "Avocado"] },
            { meal: "Lunch", foods: ["Chicken Breast", "Brown Rice", "Steamed Broccoli"] },
            { meal: "Snack", foods: ["Protein Shake", "Banana"] },
            { meal: "Dinner", foods: ["Grilled Fish / Chicken", "Vegetables", "Sweet Potato"] },
        ],
    },
    {
        goal: "fat_loss",
        dietType: "vegetarian",
        dailyCalories: 1600,
        protein: "100g",
        carbs: "150g",
        fat: "45g",
        meals: [
            { meal: "Breakfast", foods: ["Oats + Chia Seeds", "Green Tea"] },
            { meal: "Lunch", foods: ["Quinoa", "Mixed Vegetables", "Lentil Soup"] },
            { meal: "Snack", foods: ["Almonds (10)", "Apple"] },
            { meal: "Dinner", foods: ["Paneer Salad", "Low-fat Yogurt"] },
        ],
    },
    {
        goal: "fat_loss",
        dietType: "non-vegetarian",
        dailyCalories: 1800,
        protein: "130g",
        carbs: "140g",
        fat: "50g",
        meals: [
            { meal: "Breakfast", foods: ["Boiled Eggs (3)", "Black Coffee"] },
            { meal: "Lunch", foods: ["Grilled Chicken Salad", "Olive Oil Dressing"] },
            { meal: "Snack", foods: ["Protein Shake (low cal)", "Celery Sticks"] },
            { meal: "Dinner", foods: ["Baked Fish", "Steamed Vegetables"] },
        ],
    },
    {
        goal: "endurance",
        dietType: "vegetarian",
        dailyCalories: 2000,
        protein: "110g",
        carbs: "270g",
        fat: "55g",
        meals: [
            { meal: "Breakfast", foods: ["Whole Grain Cereal", "Fruits", "Milk"] },
            { meal: "Lunch", foods: ["Pasta with Vegetables", "Tofu Stir-fry"] },
            { meal: "Snack", foods: ["Energy Bar", "Banana"] },
            { meal: "Dinner", foods: ["Brown Rice", "Paneer", "Salad"] },
        ],
    },
    {
        goal: "endurance",
        dietType: "non-vegetarian",
        dailyCalories: 2300,
        protein: "130g",
        carbs: "300g",
        fat: "60g",
        meals: [
            { meal: "Breakfast", foods: ["Omelette (3 eggs)", "Whole Wheat Toast", "OJ"] },
            { meal: "Lunch", foods: ["Grilled Chicken", "Pasta", "Salad"] },
            { meal: "Snack", foods: ["Trail Mix", "Protein Bar"] },
            { meal: "Dinner", foods: ["Salmon", "Quinoa", "Roasted Vegetables"] },
        ],
    },
];

export function getNutritionPlan(goal: string, dietType: string): NutritionPlan | undefined {
    return NUTRITION_PLANS.find((p) => p.goal === goal && p.dietType === dietType);
}
