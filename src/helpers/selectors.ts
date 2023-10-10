import type { Activity, ActivityTime } from "../types";
import { activities, type Category } from "../../zzzAlgorithm/activities";

export const getActivity = (category: Category, time: ActivityTime) => {
    const filteredActivities = activities.filter((activity) => {
        return activity.category === category && activity.time === time;
    });
    const randomIndex = Math.floor(Math.random() * filteredActivities.length);
    return filteredActivities[randomIndex];
};

export const getRandomActivity = (activities: Activity<Category>[], time: ActivityTime) => {
    const filteredActivities = activities.filter((activity) => {
        return activity.time === time;
    });
    const randomIndex = Math.floor(Math.random() * filteredActivities.length);
    return filteredActivities[randomIndex];
};
