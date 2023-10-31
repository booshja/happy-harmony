import { render, screen } from "@testing-library/react";
import { SelectorWrapper } from "./";
import { ACTIVITY_TIMES, testingIds } from "../../../../helpers";
import type { Activity } from "../../../../types";

import { Category } from "../../../../../zzzAlgorithm/activities";
import userEvent from "@testing-library/user-event";

const wrapperIds = testingIds.selectors.wrapper;
const selectorsIds = testingIds.selectors;

const categories: Category[] = ["Music", "Coding"];

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

describe("SelectorWrapper", () => {
    it("should render all elements correctly for SelectorWrapper", () => {
        render(<SelectorWrapper activities={activities} categories={categories} />);

        expect(screen.getByTestId(wrapperIds.buttonSection)).toBeInTheDocument();
        expect(screen.getAllByTestId(wrapperIds.selectorButton)).toHaveLength(3);
        expect(screen.getByTestId(selectorsIds.categories.form)).toBeInTheDocument();
    });

    it("should render the RandomSelector component when the Random button is clicked", async () => {
        const user = userEvent.setup();

        const { getAllByTestId } = render(
            <SelectorWrapper activities={activities} categories={categories} />
        );

        await user.click(getAllByTestId(wrapperIds.selectorButton)[1]);

        expect(screen.getByText("Random Activity Selector")).toBeInTheDocument();
        expect(screen.getByTestId(selectorsIds.time.form)).toBeInTheDocument();
    });

    it("should render the CategorySelector component when the Random button is clicked", async () => {
        const user = userEvent.setup();

        const { getByTestId, getAllByTestId } = render(
            <SelectorWrapper activities={activities} categories={categories} />
        );

        await user.click(getAllByTestId(wrapperIds.selectorButton)[0]);

        expect(getByTestId(selectorsIds.categories.form)).toBeInTheDocument();
        expect(getByTestId(selectorsIds.category.title)).toBeInTheDocument();
    });

    it("should render the ListSelector component when the List button is clicked", async () => {
        const user = userEvent.setup();

        const { getByTestId, getAllByTestId } = render(
            <SelectorWrapper activities={activities} categories={categories} />
        );

        await user.click(getAllByTestId(wrapperIds.selectorButton)[2]);

        expect(getByTestId(selectorsIds.time.form)).toBeInTheDocument();
        expect(getByTestId(selectorsIds.list.title)).toBeInTheDocument();
    });
});
