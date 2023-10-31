export const ACTIVITY_TIMES = {
    0: "0-5 minutes",
    5: "5-10 minutes",
    10: "10-30 minutes",
    30: "30+ minutes",
    60: "60+ minutes",
    3: "3+ hours",
    "half-day": "Half a day",
    "full-day": "Full day",
} as const;

export const SELECTORS = {
    RANDOM_SELECTOR: "random",
    CATEGORY_SELECTOR: "category",
    LIST_SELECTOR: "list",
};

export const SELECTOR_STEPS = ["category", "time", "result"] as const;
export const RANDOM_SELECTOR_STEPS = ["time", "result"] as const;

export type SelectorSteps = typeof SELECTOR_STEPS;
export type RandomSelectorSteps = typeof RANDOM_SELECTOR_STEPS;
