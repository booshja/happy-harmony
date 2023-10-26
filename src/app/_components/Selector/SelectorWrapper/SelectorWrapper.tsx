"use client";

import { useState } from "react";
import { RandomSelector } from "../RandomSelector";
import { SELECTORS, testingIds } from "../../../../helpers";
import type { Activity, Selector } from "../../../../types";

import { Category } from "../../../../../zzzAlgorithm/activities";

export interface SelectorWrapperProps {
    activities: Activity<Category>[];
}

const wrapperIds = testingIds.selectors.wrapper;

export const SelectorWrapper = ({ activities }: SelectorWrapperProps) => {
    const { CATEGORY_SELECTOR, LIST_SELECTOR, RANDOM_SELECTOR } = SELECTORS;
    const [selector, setSelector] = useState<Selector>(RANDOM_SELECTOR);

    return (
        <div>
            <section data-client-id={wrapperIds.buttonSection}>
                <button
                    onClick={() => setSelector(RANDOM_SELECTOR)}
                    data-client-id={wrapperIds.selectorButton}
                >
                    Random
                </button>
                <button
                    onClick={() => setSelector(CATEGORY_SELECTOR)}
                    data-client-id={wrapperIds.selectorButton}
                >
                    Category
                </button>
                <button
                    onClick={() => setSelector(LIST_SELECTOR)}
                    data-client-id={wrapperIds.selectorButton}
                >
                    List
                </button>
            </section>
            {selector === RANDOM_SELECTOR && <RandomSelector activities={activities} />}
            {selector === CATEGORY_SELECTOR && <div>Category</div>}
            {selector === LIST_SELECTOR && <div>List</div>}
        </div>
    );
};
