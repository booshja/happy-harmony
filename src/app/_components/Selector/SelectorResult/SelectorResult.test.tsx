import { render, screen } from "@testing-library/react";
import { SelectorResult } from "./SelectorResult";
import { ACTIVITY_TIMES, testingIds } from "../../../../helpers";
import type { Activity } from "../../../../types";

import { Category } from "../../../../../zzzAlgorithm/activities";

const mockReset = jest.fn();
const resultIds = testingIds.selectors.result;

describe("SelectorResult", () => {
    it("should render all elements correctly for Random Activity Selector", () => {
        const activity: Activity<Category> = {
            name: "Test Activity",
            category: "Music",
            time: ACTIVITY_TIMES[60],
        };

        render(<SelectorResult activity={activity} selectorType={"random"} handleReset={mockReset} />);

        expect(screen.getByTestId(resultIds.wrapper)).toBeInTheDocument();
        expect(screen.getByTestId(resultIds.activity)).toBeInTheDocument();
        expect(screen.getByTestId(resultIds.category)).toBeInTheDocument();
        expect(screen.getByTestId(resultIds.time)).toBeInTheDocument();
        expect(screen.getByTestId(resultIds.resetButton)).toBeInTheDocument();

        expect(screen.getByText(activity.name)).toBeInTheDocument();
        expect(screen.getByText(activity.category)).toBeInTheDocument();
        expect(screen.getByText(activity.time)).toBeInTheDocument();
    });
});
