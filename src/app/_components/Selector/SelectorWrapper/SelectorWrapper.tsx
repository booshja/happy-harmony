"use client";

import { CategorySelector } from "../CategorySelector";
import { ListSelector } from "../ListSelector";
import { RandomSelector } from "../RandomSelector";
import { SELECTORS, testingIds } from "../../../../helpers";
import {
    SelectorWrapperButtonStyled,
    SelectorWrapperButtonsContainerStyled,
    SelectorWrapperStyled,
} from "./SelectorWrapperStyled";
import { useState } from "react";
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
        <SelectorWrapperStyled>
            <SelectorWrapperButtonsContainerStyled
                data-client-id={wrapperIds.buttonSection}
            >
                <SelectorWrapperButtonStyled
                    onClick={() => setSelector(CATEGORY_SELECTOR)}
                    data-client-id={wrapperIds.selectorButton}
                >
                    Individual Activity
                </SelectorWrapperButtonStyled>
                <SelectorWrapperButtonStyled
                    onClick={() => setSelector(RANDOM_SELECTOR)}
                    data-client-id={wrapperIds.selectorButton}
                >
                    Random Activity
                </SelectorWrapperButtonStyled>
                <SelectorWrapperButtonStyled
                    onClick={() => setSelector(LIST_SELECTOR)}
                    data-client-id={wrapperIds.selectorButton}
                >
                    List of Activities
                </SelectorWrapperButtonStyled>
            </SelectorWrapperButtonsContainerStyled>
            {selector === RANDOM_SELECTOR && <RandomSelector activities={activities} />}
            {selector === CATEGORY_SELECTOR && (
                <CategorySelector activities={activities} categories={categories} />
            )}
            {selector === LIST_SELECTOR && <ListSelector activities={activities} />}
        </SelectorWrapperStyled>
    );
};
