import { SelectorWrapper } from "../_components/Selector/SelectorWrapper";

import { activities } from "../../../zzzAlgorithm/activities";
import { testingIds } from "../../helpers";

// async function getActivities() {
//     const res = await fetch();

//     if (!res.ok) {
//         throw new Error('Failed to fetch activities');
//     }

//     return res.json();
// }

async function getActivities() {
    return activities;
}

const selectorIds = testingIds.pages.selector;

export default async function SelectorPage() {
    const activities = await getActivities();

    return (
        <main>
            <h1 data-client-id={selectorIds.title}>Activity Selectors</h1>
            <SelectorWrapper activities={activities} />
        </main>
    );
}
