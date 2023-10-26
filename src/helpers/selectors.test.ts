import { Category } from "../../zzzAlgorithm/activities";
import { Activity } from "../types";
import { ACTIVITY_TIMES, getActivity, getRandomActivity } from "./";

describe("Selectors", () => {
    describe("getActivity", () => {
        it("returns an activity", () => {
            const category = "Music";
            const time = ACTIVITY_TIMES[0];
            const activity = getActivity(category, time);
            expect(activity.category).toEqual(category);
            expect(activity.time).toEqual(time);
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
            const activity = getRandomActivity(activities, time);
            expect(activity.time).toEqual(time);
        });
    });
});
