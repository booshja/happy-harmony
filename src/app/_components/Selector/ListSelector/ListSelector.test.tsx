import { render, screen } from "@testing-library/react";
import { ListSelector } from "./";
import { ACTIVITY_TIMES, testingIds } from "../../../../helpers";
import type { Activity } from "../../../../types";
import userEvent from "@testing-library/user-event";

import { Category } from "../../../../../zzzAlgorithm/activities";

const selectorsIds = testingIds.selectors;

const activities: Activity<Category>[] = [
    {
        category: "Coding",
        time: ACTIVITY_TIMES[0],
        name: "Write a test",
    },
    {
        category: "Coding",
        time: ACTIVITY_TIMES[5],
        name: "Write another test",
    },
    {
        category: "Coding",
        time: ACTIVITY_TIMES[10],
        name: "Write yet another test",
    },
    {
        category: "Coding",
        time: ACTIVITY_TIMES[10],
        name: "Oh look another test",
    },
    {
        category: "Coding",
        time: ACTIVITY_TIMES[10],
        name: "That's a lot of tests",
    },
];

describe("ListSelector", () => {
    it("should render all elements correctly for ListSelector component", () => {
        render(<ListSelector activities={activities} />);

        expect(screen.getByTestId(selectorsIds.list.title)).toBeInTheDocument();
        expect(screen.getByText("Activity List Selector")).toBeInTheDocument();
        expect(screen.getByTestId(selectorsIds.time.form)).toBeInTheDocument();
    });

    it("should change step to result after clicking button", async () => {
        const user = userEvent.setup();

        const { getByTestId, getAllByTestId } = render(
            <ListSelector activities={activities} />
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

        const { getByTestId, getAllByTestId } = render(
            <ListSelector activities={activities} />
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
