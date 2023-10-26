import { render, screen } from "@testing-library/react";
import { SelectTime } from "./";
import { testingIds, ACTIVITY_TIMES } from "../../../../helpers";
import userEvent from "@testing-library/user-event";

const mockHandleNextStep = jest.fn();
const mockSetTime = jest.fn();
const selectTimeIds = testingIds.selectors.time;

describe("SelectTime", () => {
    it("should render all elements correctly for SelectTime component", () => {
        render(
            <SelectTime handleNextStep={mockHandleNextStep} setTime={mockSetTime} />
        );

        expect(screen.getByTestId(selectTimeIds.form)).toBeInTheDocument();
        expect(screen.getByTestId(selectTimeIds.label)).toBeInTheDocument();
        expect(screen.getByTestId(selectTimeIds.select)).toBeInTheDocument();
        expect(screen.getAllByTestId(selectTimeIds.selectOptions)).toHaveLength(9);
        expect(screen.getByTestId(selectTimeIds.chooseButton)).toBeInTheDocument();

        expect(screen.getByText("Time")).toBeInTheDocument();
    });

    it("should call the setTime function when a time is selected", async () => {
        const user = userEvent.setup();

        const { getByTestId, getAllByTestId } = render(
            <SelectTime handleNextStep={mockHandleNextStep} setTime={mockSetTime} />
        );

        await user.selectOptions(
            getByTestId(selectTimeIds.select),
            getAllByTestId(selectTimeIds.selectOptions)[0]
        );

        expect(mockSetTime.mock.calls).toHaveLength(1);
    });

    it("should call the setTime function when a time is selected", async () => {
        const user = userEvent.setup();

        const { getByTestId, getAllByTestId, getByText } = render(
            <SelectTime handleNextStep={mockHandleNextStep} setTime={mockSetTime} />
        );

        await user.selectOptions(
            getByTestId(selectTimeIds.select),
            getByText(ACTIVITY_TIMES[0])
        );

        expect(
            (getByText(ACTIVITY_TIMES[0]) as HTMLOptionElement).selected
        ).toBeTruthy();
        expect(
            (getByText(ACTIVITY_TIMES[60]) as HTMLOptionElement).selected
        ).toBeFalsy();
        await user.click(getByTestId(selectTimeIds.chooseButton));

        expect(mockHandleNextStep.mock.calls).toHaveLength(1);
    });
});
