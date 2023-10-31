import { activities } from "./../../zzzAlgorithm/activities";
import type { Activity, ActivityTime } from "../types";
import type { Category } from "../../zzzAlgorithm/activities";

export interface GetActivity {
    category: Category;
    time: ActivityTime;
    activities: Activity<Category>[];
}

export interface GetRandomActivity {
    activities: Activity<Category>[];
    time: ActivityTime;
}

export interface GetActivityList {
    activities: Activity<Category>[];
    time: ActivityTime;
}

export const getActivity = ({ activities, category, time }: GetActivity) => {
    const filteredActivities = activities.filter((activity) => {
        return activity.category === category && activity.time === time;
    });
    if (filteredActivities.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * filteredActivities.length);
    const activity = filteredActivities[randomIndex];
    return activity;
};

export const getRandomActivity = ({ activities, time }: GetRandomActivity) => {
    const filteredActivities = activities.filter((activity) => {
        return activity.time === time;
    });
    if (filteredActivities.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * filteredActivities.length);
    return filteredActivities[randomIndex];
};

export const getActivityList = ({ activities, time }: GetActivityList) => {
    const filteredActivities = activities.filter((activity) => {
        return activity.time === time;
    });
    if (filteredActivities.length === 0) return [];

    return filteredActivities;
};
