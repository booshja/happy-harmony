import { screen } from "@testing-library/react";
import { testingIds } from "../../helpers";
import SelectorPage from "./page";
import { renderServerComponent } from "../../lib/renderServerComponent";

const selectorIds = testingIds.pages.selector;

describe("Selector Page", () => {
    it("should render the selector page", async () => {
        await renderServerComponent(<SelectorPage />);

        expect(screen.getByTestId(selectorIds.title)).toBeInTheDocument();
        expect(screen.getByText("Random Activity Selector")).toBeInTheDocument();
    });
});
