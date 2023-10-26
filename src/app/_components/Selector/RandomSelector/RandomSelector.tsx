"use client";

import { useState } from "react";
import { SelectTime } from "../SelectTime";
import { SelectorResult } from "../SelectorResult";
import { getRandomActivity, testingIds } from "../../../../helpers";
import type { Activity, ActivityTime } from "../../../../types";

import { Category } from "../../../../../zzzAlgorithm/activities";

interface RandomSelectorProps {
    activities: Activity<Category>[];
}

export const RandomSelector = ({ activities }: RandomSelectorProps) => {
    const steps = ["time", "result"] as const;

    const [step, setStep] = useState<(typeof steps)[number]>(steps[0]);
    const [time, setTime] = useState<ActivityTime | null>(null);
    const [activity, setActivity] = useState<Activity<Category> | null>(null);

    const handleNextStep = () => {
        determineActivity();
        setStep(steps[1]);
    };

    const handleReset = () => {
        setStep(steps[0]);
        setTime(null);
        setActivity(null);
    };

    const determineActivity = () => {
        if (!time) return;

        const activity = getRandomActivity(activities, time);
        setActivity(activity);
    };

    return (
        <>
            <h1 data-client-id={testingIds.selectors.random.title}>
                Random Activity Selector
            </h1>
            {step === "time" && (
                <SelectTime setTime={setTime} handleNextStep={handleNextStep} />
            )}
            {step === "result" && activity && (
                <SelectorResult
                    activity={activity}
                    selectorType="random"
                    handleReset={handleReset}
                />
            )}
        </>
    );
};
