"use client";

import { SelectTime } from "../SelectTime";
import {
    RANDOM_SELECTOR_STEPS,
    SELECTORS,
    getActivityList,
    testingIds,
    type RandomSelectorSteps,
} from "../../../../helpers";
import type { Activity, ActivityTime } from "../../../../types";
import { SelectorResult } from "../SelectorResult";
import { useState } from "react";

import type { Category } from "../../../../../zzzAlgorithm/activities";

export interface ListSelectorProps {
    activities: Activity<Category>[];
}

const listSelectorIds = testingIds.selectors.list;

export const ListSelector = ({ activities }: ListSelectorProps) => {
    const [step, setStep] = useState<RandomSelectorSteps[number]>(
        RANDOM_SELECTOR_STEPS[0]
    );
    const [time, setTime] = useState<ActivityTime | null>(null);
    const [activityList, setActivityList] = useState<Activity<Category>[] | null>(null);

    const handleNextStep = () => {
        determineActivity();
        setStep(RANDOM_SELECTOR_STEPS[1]);
    };

    const handleReset = () => {
        setStep(RANDOM_SELECTOR_STEPS[0]);
        setTime(null);
        setActivityList(null);
    };

    const determineActivity = () => {
        if (!time) return;

        const list = getActivityList({ activities, time });
        setActivityList(list);
    };

    return (
        <>
            <h1 data-client-id={listSelectorIds.title}>Activity List Selector</h1>
            {step === "time" && (
                <SelectTime setTime={setTime} handleNextStep={handleNextStep} />
            )}
            {step === "result" && activityList && (
                <SelectorResult
                    activityList={activityList}
                    selectorType={SELECTORS.LIST_SELECTOR}
                    handleReset={handleReset}
                />
            )}
        </>
    );
};
