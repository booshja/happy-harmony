import { screen } from "@testing-library/react";
import { testingIds } from "../helpers";
import LandingPage from "./page";
import { renderServerComponent } from "../lib/renderServerComponent";

const landingIds = testingIds.pages.landing;

describe("Home Page", () => {
    it("should render the home page", async () => {
        await renderServerComponent(<LandingPage />);

        expect(screen.getByTestId(landingIds.title)).toBeInTheDocument();
        expect(screen.getByTestId(landingIds.description)).toBeInTheDocument();
        expect(screen.getByTestId(landingIds.grid)).toBeInTheDocument();
        expect(screen.getAllByTestId(landingIds.gridItem)).toHaveLength(3);
        expect(screen.getAllByTestId(landingIds.gridItemTitle)).toHaveLength(3);
        expect(screen.getAllByTestId(landingIds.gridItemDescription)).toHaveLength(3);
    });
});
