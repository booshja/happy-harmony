import { Activity } from "../../types";
import { SelectorPageStyled, SelectorPageTitleStyled } from "./_pageStyled";
import { SelectorWrapper } from "../_components";
import { testingIds } from "../../helpers";

import { Category } from "../../../zzzAlgorithm/activities";

interface SelectorPageProps {
    activities: Activity<Category>[];
    categories: Category[];
}

const selectorIds = testingIds.pages.selector;

export const SelectorPage = ({ activities, categories }: SelectorPageProps) => {
    return (
        <SelectorPageStyled>
            <SelectorPageTitleStyled data-client-id={selectorIds.title}>
                Activity Selectors
            </SelectorPageTitleStyled>
            <SelectorWrapper activities={activities} categories={categories} />
        </SelectorPageStyled>
    );
};
