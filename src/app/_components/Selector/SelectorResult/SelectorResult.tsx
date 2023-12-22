import {
    ResultActivityButtonStyled,
    ResultActivityTextSpanStyled,
    ResultActivityTextStyled,
    ResultContainerStyled,
    ResultListStyled,
    SingleResultContainerStyled,
} from "./SelectorResultStyled";
import { SELECTORS, testingIds } from "../../../../helpers";
import type { Activity, Selector } from "../../../../types";

import type { Category } from "../../../../../zzzAlgorithm/activities";

export interface SelectorResultProps {
    selectorType: Selector;
    activity?: Activity<Category> | null;
    activityList?: Activity<Category>[];
    handleReset: () => void;
}

const resultIds = testingIds.selectors.result;

export const SelectorResult = ({
    activity,
    activityList,
    selectorType,
    handleReset,
}: SelectorResultProps) => {
    const { RANDOM_SELECTOR, CATEGORY_SELECTOR, LIST_SELECTOR } = SELECTORS;

    const isSingleActivity =
        selectorType === RANDOM_SELECTOR || selectorType === CATEGORY_SELECTOR;
    const isList = selectorType === LIST_SELECTOR;
    const isRandom = selectorType === RANDOM_SELECTOR;

    const noResult = !activity && !activityList;
    const numActivities = activityList?.length;

    return (
        <ResultContainerStyled data-client-id={resultIds.wrapper}>
            {isSingleActivity && activity && (
                <SingleResultContainerStyled>
                    <ResultActivityTextStyled data-client-id={resultIds.activity}>
                        <ResultActivityTextSpanStyled>
                            Activity:
                        </ResultActivityTextSpanStyled>{" "}
                        {activity.name}
                    </ResultActivityTextStyled>
                    <ResultActivityTextStyled data-client-id={resultIds.category}>
                        <ResultActivityTextSpanStyled>
                            Category:
                        </ResultActivityTextSpanStyled>{" "}
                        {activity.category}
                    </ResultActivityTextStyled>
                    <ResultActivityTextStyled data-client-id={resultIds.time}>
                        <ResultActivityTextSpanStyled>
                            Time:
                        </ResultActivityTextSpanStyled>{" "}
                        {activity.time}
                    </ResultActivityTextStyled>
                </SingleResultContainerStyled>
            )}
            {isList && activityList && (
                <>
                    <ResultActivityTextStyled data-client-id={""}>
                        {numActivities} activities matched your choices:
                    </ResultActivityTextStyled>
                    <ResultListStyled>
                        {activityList.map((activity, idx) => (
                            <li key={idx} data-client-id={resultIds.listItem}>
                                <ResultActivityTextStyled
                                    data-client-id={resultIds.activity}
                                >
                                    <ResultActivityTextSpanStyled>
                                        Activity:
                                    </ResultActivityTextSpanStyled>{" "}
                                    {activity.name}
                                </ResultActivityTextStyled>
                                <ResultActivityTextStyled
                                    data-client-id={resultIds.category}
                                >
                                    <ResultActivityTextSpanStyled>
                                        Category:
                                    </ResultActivityTextSpanStyled>{" "}
                                    {activity.category}
                                </ResultActivityTextStyled>
                                <ResultActivityTextStyled
                                    data-client-id={resultIds.time}
                                >
                                    <ResultActivityTextSpanStyled>
                                        Time:
                                    </ResultActivityTextSpanStyled>{" "}
                                    {activity.time}
                                </ResultActivityTextStyled>
                            </li>
                        ))}
                    </ResultListStyled>
                </>
            )}
            {noResult && (
                <ResultActivityTextStyled data-client-id={resultIds.noResult}>
                    Uh oh, looks like no activities matched your{" "}
                    {isRandom ? "choice" : "choices"}!
                </ResultActivityTextStyled>
            )}
            <ResultActivityButtonStyled
                onClick={handleReset}
                data-client-id={resultIds.resetButton}
            >
                Reset
            </ResultActivityButtonStyled>
        </ResultContainerStyled>
    );
};
