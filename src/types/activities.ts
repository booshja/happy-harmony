import { ACTIVITY_TIMES } from "../helpers";

export type ActivityKeys = keyof typeof ACTIVITY_TIMES;
export type ActivityTime = (typeof ACTIVITY_TIMES)[ActivityKeys];

export type Activity<T> = {
    name: string;
    time: ActivityTime;
    category: T;
};
