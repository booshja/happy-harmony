import { render, screen } from "@testing-library/react";
import { SelectCategory } from "./";
import { testingIds, ACTIVITY_TIMES } from "../../../../helpers";
import userEvent from "@testing-library/user-event";
import { Category } from "../../../../../zzzAlgorithm/activities";

const mockHandleNextStep = jest.fn();
const mockSetCategory = jest.fn();
const categoriesIds = testingIds.selectors.categories;

const categories: Category[] = ["Music", "Dogs", "Plants", "Coding"];

describe("SelectTime", () => {
    it("should render all elements correctly for SelectTime component", () => {
        render(
            <SelectCategory
                handleNextStep={mockHandleNextStep}
                setCategory={mockSetCategory}
                categories={categories}
            />
        );

        expect(screen.getByTestId(categoriesIds.form)).toBeInTheDocument();
        expect(screen.getByTestId(categoriesIds.label)).toBeInTheDocument();
        expect(screen.getByTestId(categoriesIds.select)).toBeInTheDocument();
        expect(screen.getAllByTestId(categoriesIds.selectOptions)).toHaveLength(5);
        expect(screen.getByTestId(categoriesIds.chooseButton)).toBeInTheDocument();

        expect(screen.getByText("Category")).toBeInTheDocument();
    });

    it("should call the setTime function when a time is selected", async () => {
        const user = userEvent.setup();

        const { getByTestId, getAllByTestId } = render(
            <SelectCategory
                handleNextStep={mockHandleNextStep}
                setCategory={mockSetCategory}
                categories={categories}
            />
        );

        await user.selectOptions(
            getByTestId(categoriesIds.select),
            getAllByTestId(categoriesIds.selectOptions)[0]
        );

        expect(mockSetCategory.mock.calls).toHaveLength(1);
    });

    it("should call the setTime function when a time is selected", async () => {
        const user = userEvent.setup();

        const { getByTestId, getAllByTestId, getByText } = render(
            <SelectCategory
                handleNextStep={mockHandleNextStep}
                setCategory={mockSetCategory}
                categories={categories}
            />
        );

        await user.selectOptions(
            getByTestId(categoriesIds.select),
            getByText(categories[0])
        );

        expect((getByText(categories[0]) as HTMLOptionElement).selected).toBeTruthy();
        expect((getByText(categories[2]) as HTMLOptionElement).selected).toBeFalsy();
        await user.click(getByTestId(categoriesIds.chooseButton));

        expect(mockHandleNextStep.mock.calls).toHaveLength(1);
    });
});
