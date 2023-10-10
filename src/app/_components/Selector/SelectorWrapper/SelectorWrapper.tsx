"use client";

import { useState } from "react";
import { RandomSelector } from "../RandomSelector";
import { SELECTORS } from "../../../../helpers";
import type { Activity, Selector } from "../../../../types";

import { Category } from "../../../../../zzzAlgorithm/activities";

export interface SelectorWrapperProps {
    activities: Activity<Category>[];
}

export const SelectorWrapper = ({ activities }: SelectorWrapperProps) => {
    const { CATEGORY_SELECTOR, LIST_SELECTOR, RANDOM_SELECTOR } = SELECTORS;
    const [selector, setSelector] = useState<Selector>(RANDOM_SELECTOR);

    return (
        <div>
            <section>
                <button onClick={() => setSelector(RANDOM_SELECTOR)}>Random</button>
                <button onClick={() => setSelector(CATEGORY_SELECTOR)}>Category</button>
                <button onClick={() => setSelector(LIST_SELECTOR)}>List</button>
            </section>
            {selector === RANDOM_SELECTOR && <RandomSelector activities={activities} />}
            {selector === CATEGORY_SELECTOR && <div>Category</div>}
            {selector === LIST_SELECTOR && <div>List</div>}
        </div>
    );
};
