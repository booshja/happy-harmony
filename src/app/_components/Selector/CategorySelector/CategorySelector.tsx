"use client";

import { useState } from "react";
import { SelectTime } from "../SelectTime";
import { SelectCategory } from "../SelectCategory";
import { SelectorResult } from "../SelectorResult";
import {
    getActivity,
    testingIds,
    SELECTOR_STEPS,
    SELECTORS,
    type SelectorSteps,
} from "../../../../helpers";
import type { Activity, ActivityTime } from "../../../../types";

import type { Category } from "../../../../../zzzAlgorithm/activities";

export interface CategorySelectorProps {
    activities: Activity<Category>[];
    categories: Category[];
}

const categoryIds = testingIds.selectors.category;

export const CategorySelector = ({ activities, categories }: CategorySelectorProps) => {
    const [step, setStep] = useState<SelectorSteps[number]>(SELECTOR_STEPS[0]);
    const [time, setTime] = useState<ActivityTime | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [activity, setActivity] = useState<Activity<Category> | null>(null);

    const handleNextStep = () => {
        switch (step) {
            case SELECTOR_STEPS[1]:
                determineActivity();
                setStep(SELECTOR_STEPS[2]);
                break;
            default:
                setStep(SELECTOR_STEPS[1]);
                break;
        }
    };

    const determineActivity = () => {
        if (!time || !category) return;

        const activity = getActivity({ category, time, activities });
        setActivity(activity);
    };

    const handleReset = () => {
        setStep(SELECTOR_STEPS[0]);
        setTime(null);
        setCategory(null);
        setActivity(null);
    };

    return (
        <>
            <h1 data-client-id={categoryIds.title}>Activity Selector</h1>
            {step === "time" && (
                <SelectTime setTime={setTime} handleNextStep={handleNextStep} />
            )}
            {step === "category" && (
                <SelectCategory
                    categories={categories}
                    setCategory={setCategory}
                    handleNextStep={handleNextStep}
                />
            )}
            {step === "result" && (
                <SelectorResult
                    activity={activity}
                    selectorType={SELECTORS.CATEGORY_SELECTOR}
                    handleReset={handleReset}
                />
            )}
        </>
    );
};
