import { SelectorWrapper } from "../_components/Selector/SelectorWrapper";

import { activities } from "../../../zzzAlgorithm/activities";

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

export default async function SelectorPage() {
    const activities = await getActivities();
    return (
        <main>
            <h1>Activity Selectors</h1>
            <SelectorWrapper activities={activities} />
        </main>
    );
}
