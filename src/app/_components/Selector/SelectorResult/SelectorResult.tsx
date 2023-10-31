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

    return (
        <div data-client-id={resultIds.wrapper}>
            {isSingleActivity && activity && (
                <>
                    <p data-client-id={resultIds.activity}>
                        <span>Activity:</span> {activity.name}
                    </p>
                    <p data-client-id={resultIds.category}>
                        <span>Category:</span> {activity.category}
                    </p>
                    <p data-client-id={resultIds.time}>
                        <span>Time:</span> {activity.time}
                    </p>
                </>
            )}
            {isList && activityList && (
                <>
                    <ul>
                        {activityList.map((activity, idx) => (
                            <li key={idx} data-client-id={resultIds.listItem}>
                                <p data-client-id={resultIds.activity}>
                                    <span>Activity:</span> {activity.name}
                                </p>
                                <p data-client-id={resultIds.category}>
                                    <span>Category:</span> {activity.category}
                                </p>
                                <p data-client-id={resultIds.time}>
                                    <span>Time:</span> {activity.time}
                                </p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {noResult && (
                <p data-client-id={resultIds.noResult}>
                    Uh oh, looks like no activities matched your{" "}
                    {isRandom ? "choice" : "choices"}!
                </p>
            )}
            <button onClick={handleReset} data-client-id={resultIds.resetButton}>
                Reset
            </button>
        </div>
    );
};
