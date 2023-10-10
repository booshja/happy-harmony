import { render, screen } from "@testing-library/react";
import { SelectorResult } from "./SelectorResult";
import { ACTIVITY_TIMES, testingIds } from "../../../../helpers";
import type { Activity } from "../../../../types";

import { Category } from "../../../../../zzzAlgorithm/activities";

describe("SelectorResult", () => {
    it("should render all elements correctly for Random Activity Selector", () => {
        const activity: Activity<Category> = {
            name: "Test Activity",
            category: "Music",
            time: ACTIVITY_TIMES[60],
        };

        render(<SelectorResult activity={activity} selectorType={"random"} />);

        expect(screen.getByTestId(testingIds.selectors.result.wrapper)).toBeInTheDocument();
        expect(screen.getByTestId(testingIds.selectors.result.activity)).toBeInTheDocument();
        expect(screen.getByTestId(testingIds.selectors.result.category)).toBeInTheDocument();
        expect(screen.getByTestId(testingIds.selectors.result.time)).toBeInTheDocument();

        expect(screen.getByText(activity.name)).toBeInTheDocument();
        expect(screen.getByText(activity.category)).toBeInTheDocument();
        expect(screen.getByText(activity.time)).toBeInTheDocument();
    });
});
