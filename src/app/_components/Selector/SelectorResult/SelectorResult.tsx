import { SELECTORS, testingIds } from "../../../../helpers";
import type { Activity, Selector } from "../../../../types";

import type { Category } from "../../../../../zzzAlgorithm/activities";

export interface SelectorResultProps {
    selectorType: Selector;
    activity?: Activity<Category>;
    activityList?: Activity<Category>[];
}

export const SelectorResult = ({ activity, activityList, selectorType }: SelectorResultProps) => {
    const { RANDOM_SELECTOR, CATEGORY_SELECTOR, LIST_SELECTOR } = SELECTORS;

    return (
        <div data-client-id={testingIds.selectors.result.wrapper}>
            {selectorType === (RANDOM_SELECTOR || CATEGORY_SELECTOR) && activity && (
                <>
                    <p data-client-id={testingIds.selectors.result.activity}>
                        <span>Activity:</span> {activity.name}
                    </p>
                    <p data-client-id={testingIds.selectors.result.category}>
                        <span>Category:</span> {activity.category}
                    </p>
                    <p data-client-id={testingIds.selectors.result.time}>
                        <span>Time:</span> {activity.time}
                    </p>
                </>
            )}
            {selectorType === LIST_SELECTOR && activityList && (
                <>
                    <ul>
                        {activityList.map((activity, idx) => (
                            <li key={idx} data-client-id={testingIds.selectors.result.listItem}>
                                <p data-client-id={testingIds.selectors.result.activity}>
                                    <span>Activity:</span> {activity.name}
                                </p>
                                <p data-client-id={testingIds.selectors.result.category}>
                                    <span>Category:</span> {activity.category}
                                </p>
                                <p data-client-id={testingIds.selectors.result.time}>
                                    <span>Time:</span> {activity.time}
                                </p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};
