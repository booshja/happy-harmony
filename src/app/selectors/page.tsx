import { SelectorPage } from "./_SelectorPage";

import {
    activities,
    categories as importedCategories,
} from "../../../zzzAlgorithm/activities";
const categories = [...importedCategories];

// async function getData() {
//     const res = await fetch();

//     if (!res.ok) {
//         throw new Error('Failed to fetch data');
//     }

//     return res.json();
// }

async function getData() {
    return { activities, categories };
}

export default async function SelectorsPage() {
    const { activities, categories } = await getData();

    return <SelectorPage activities={activities} categories={categories} />;
}
