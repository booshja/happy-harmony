import { SELECTORS, testingIds } from "../../../../helpers";
import type { Activity, Selector } from "../../../../types";

import type { Category } from "../../../../../zzzAlgorithm/activities";

export interface SelectorResultProps {
    selectorType: Selector;
    activity?: Activity<Category>;
    activityList?: Activity<Category>[];
    handleReset: () => void;
}

const resultIds = testingIds.selectors.result;

export const SelectorResult = ({ activity, activityList, selectorType, handleReset }: SelectorResultProps) => {
    const { RANDOM_SELECTOR, CATEGORY_SELECTOR, LIST_SELECTOR } = SELECTORS;

    return (
        <div data-client-id={resultIds.wrapper}>
            {selectorType === (RANDOM_SELECTOR || CATEGORY_SELECTOR) && activity && (
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
            {selectorType === LIST_SELECTOR && activityList && (
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
            <button onClick={handleReset} data-client-id={resultIds.resetButton}>
                Reset
            </button>
        </div>
    );
};
