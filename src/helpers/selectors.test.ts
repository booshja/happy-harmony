import { activities } from "./../../zzzAlgorithm/activities";
import { Category } from "../../zzzAlgorithm/activities";
import { Activity } from "../types";
import { ACTIVITY_TIMES, getActivity, getRandomActivity } from "./";

describe("Selectors", () => {
    describe("getActivity", () => {
        it("returns an activity", () => {
            const category = "Coding";
            const time = ACTIVITY_TIMES[0];
            const name = "Write a test";
            const activities: Activity<Category>[] = [{ category, time, name }];
            const activity = getActivity({ category, time, activities });
            expect(activity).not.toBeNull();

            if (!activity) throw new Error("Activity is null");

            expect(activity.category).toEqual(category);
            expect(activity.time).toEqual(time);
            expect(activity.name).toEqual(name);
        });

        it("returns null if there is not a matching activity", () => {
            const activities: Activity<Category>[] = [];
            const activity = getActivity({
                category: "Coding",
                time: ACTIVITY_TIMES[60],
                activities,
            });
            expect(activity).toBeNull();
        });
    });
    describe("getRandomActivity", () => {
        it("returns a random activity", () => {
            const activities: Activity<Category>[] = [
                {
                    category: "Music",
                    time: ACTIVITY_TIMES[0],
                    name: "Write a test",
                },
                {
                    category: "Music",
                    time: ACTIVITY_TIMES[0],
                    name: "Write another test",
                },
            ];
            const time = ACTIVITY_TIMES[0];
            const activity = getRandomActivity({ activities, time });

            if (!activity) throw new Error("Activity is null");

            expect(activity.time).toEqual(time);
        });

        it("returns null if there is not a matching activity", () => {
            const activities: Activity<Category>[] = [];
            const activity = getRandomActivity({
                activities,
                time: ACTIVITY_TIMES[60],
            });
            expect(activity).toBeNull();
        });
    });
});
