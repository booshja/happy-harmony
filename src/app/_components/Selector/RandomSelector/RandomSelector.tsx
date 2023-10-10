"use client";

import { useState } from "react";
import { SelectTime } from "../SelectTime";
import { SelectorResult } from "../SelectorResult";
import { getRandomActivity } from "../../../../helpers";
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
        if (step !== "time") return;

        determineActivity();
        setStep(steps[1]);
    };

    const determineActivity = () => {
        if (!time) return;
        const activity = getRandomActivity(activities, time);
        setActivity(activity);
    };

    return (
        <>
            {step === "time" && <SelectTime setTime={setTime} handleNextStep={handleNextStep} />}
            {step === "result" && activity && <SelectorResult activity={activity} selectorType="random" />}
        </>
    );
};
