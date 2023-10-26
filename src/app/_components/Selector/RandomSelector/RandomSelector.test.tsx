import { render, screen } from "@testing-library/react";
import { RandomSelector } from "./";
import { ACTIVITY_TIMES, testingIds } from "../../../../helpers";
import type { Activity } from "../../../../types";
import userEvent from "@testing-library/user-event";

import { Category } from "../../../../../zzzAlgorithm/activities";

const selectorsIds = testingIds.selectors;

const activities: Activity<Category>[] = [
    {
        name: "Test Activity 1",
        category: "Music",
        time: ACTIVITY_TIMES[60],
    },
    {
        name: "Test Activity 2",
        category: "Music",
        time: ACTIVITY_TIMES[0],
    },
];

describe("RandomSelector", () => {
    it("should render all elements correctly for RandomSelector component", () => {
        render(<RandomSelector activities={activities} />);

        expect(screen.getByTestId(selectorsIds.random.title)).toBeInTheDocument();
        expect(screen.getByText("Random Activity Selector")).toBeInTheDocument();
        expect(screen.getByTestId(selectorsIds.time.form)).toBeInTheDocument();
    });

    it("should change step to result after clicking button", async () => {
        const user = userEvent.setup();

        const { getByTestId, getAllByTestId, findByTestId } = render(
            <RandomSelector activities={activities} />
        );

        await user.selectOptions(
            getByTestId(selectorsIds.time.select),
            getAllByTestId(selectorsIds.time.selectOptions)[1]
        );
        await user.click(getByTestId(selectorsIds.time.chooseButton));

        expect(getByTestId(selectorsIds.result.activity)).toBeInTheDocument();
    });

    it("should call the handleReset function when the reset button is clicked", async () => {
        const user = userEvent.setup();

        const { getByTestId, getAllByTestId, findByTestId } = render(
            <RandomSelector activities={activities} />
        );

        await user.selectOptions(
            getByTestId(selectorsIds.time.select),
            getAllByTestId(selectorsIds.time.selectOptions)[1]
        );
        await user.click(getByTestId(selectorsIds.time.chooseButton));

        await user.click(getByTestId(selectorsIds.result.resetButton));

        expect(getByTestId(selectorsIds.time.form)).toBeInTheDocument();
    });
});
