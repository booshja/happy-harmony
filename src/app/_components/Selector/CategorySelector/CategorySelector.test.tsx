import { render, screen } from "@testing-library/react";
import { CategorySelector } from "./";
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

const categories: Category[] = ["Coding", "Music", "Plants", "Dogs"];

describe("CategorySelector", () => {
    it("should render all elements correctly for CategorySelector component", () => {
        render(<CategorySelector categories={categories} activities={activities} />);

        expect(screen.getByTestId(selectorsIds.category.title)).toBeInTheDocument();
        expect(screen.getByText("Activity Selector")).toBeInTheDocument();
        expect(screen.getByTestId(selectorsIds.categories.form)).toBeInTheDocument();
    });

    it("should change step to time selector after clicking button", async () => {
        const user = userEvent.setup();

        const { getByTestId, getAllByTestId } = render(
            <CategorySelector categories={categories} activities={activities} />
        );

        await user.selectOptions(
            getByTestId(selectorsIds.categories.select),
            getAllByTestId(selectorsIds.categories.selectOptions)[1]
        );
        await user.click(getByTestId(selectorsIds.categories.chooseButton));

        expect(getByTestId(selectorsIds.time.chooseButton)).toBeInTheDocument();
    });

    it("should call the handleReset function when the reset button is clicked", async () => {
        const user = userEvent.setup();

        const { getByTestId, getAllByTestId } = render(
            <CategorySelector categories={categories} activities={activities} />
        );

        await user.selectOptions(
            getByTestId(selectorsIds.categories.select),
            getAllByTestId(selectorsIds.categories.selectOptions)[1]
        );
        await user.click(getByTestId(selectorsIds.categories.chooseButton));

        await user.selectOptions(
            getByTestId(selectorsIds.time.select),
            getAllByTestId(selectorsIds.time.selectOptions)[1]
        );
        await user.click(getByTestId(selectorsIds.time.chooseButton));

        await user.click(getByTestId(selectorsIds.result.resetButton));

        expect(getByTestId(selectorsIds.categories.form)).toBeInTheDocument();
    });
});
