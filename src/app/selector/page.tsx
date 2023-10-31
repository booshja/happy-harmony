import { SelectorWrapper } from "../_components";

import {
    activities,
    categories as importedCategories,
} from "../../../zzzAlgorithm/activities";
import { testingIds } from "../../helpers";

// async function getData() {
//     const res = await fetch();

//     if (!res.ok) {
//         throw new Error('Failed to fetch data');
//     }

//     return res.json();
// }

const categories = [...importedCategories];

async function getData() {
    return { activities, categories };
}

const selectorIds = testingIds.pages.selector;

export default async function SelectorPage() {
    const { activities, categories } = await getData();

    return (
        <main>
            <h1 data-client-id={selectorIds.title}>Activity Selectors</h1>
            <SelectorWrapper activities={activities} categories={categories} />
        </main>
    );
}
