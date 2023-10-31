"use client";

import { useState } from "react";
import { RandomSelector } from "../RandomSelector";
import { CategorySelector } from "../CategorySelector";
import { SELECTORS, testingIds } from "../../../../helpers";
import type { Activity, Selector } from "../../../../types";

import { Category } from "../../../../../zzzAlgorithm/activities";

export interface SelectorWrapperProps {
    activities: Activity<Category>[];
    categories: Category[];
}

const wrapperIds = testingIds.selectors.wrapper;

export const SelectorWrapper = ({ activities, categories }: SelectorWrapperProps) => {
    const { CATEGORY_SELECTOR, LIST_SELECTOR, RANDOM_SELECTOR } = SELECTORS;
    const [selector, setSelector] = useState<Selector>(CATEGORY_SELECTOR);

    return (
        <div>
            <section data-client-id={wrapperIds.buttonSection}>
                <button
                    onClick={() => setSelector(CATEGORY_SELECTOR)}
                    data-client-id={wrapperIds.selectorButton}
                >
                    Individual Activity
                </button>
                <button
                    onClick={() => setSelector(RANDOM_SELECTOR)}
                    data-client-id={wrapperIds.selectorButton}
                >
                    Random Activity
                </button>
                <button
                    onClick={() => setSelector(LIST_SELECTOR)}
                    data-client-id={wrapperIds.selectorButton}
                >
                    List of Activities
                </button>
            </section>
            {selector === RANDOM_SELECTOR && <RandomSelector activities={activities} />}
            {selector === CATEGORY_SELECTOR && (
                <CategorySelector activities={activities} categories={categories} />
            )}
            {selector === LIST_SELECTOR && <div>List</div>}
        </div>
    );
};
