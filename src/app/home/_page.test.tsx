import { screen } from "@testing-library/react";
import { testingIds } from "../../helpers";
import HomePage from "./page";
import { renderServerComponent } from "../../lib/renderServerComponent";

const homeIds = testingIds.pages.home;

describe("Home Page", () => {
    it("should render the home page", async () => {
        await renderServerComponent(<HomePage />);

        expect(screen.getByTestId(homeIds.title)).toBeInTheDocument();
        expect(screen.getByTestId(homeIds.greeting)).toBeInTheDocument();
        expect(screen.getByTestId(homeIds.chooseActivitySection)).toBeInTheDocument();
        expect(
            screen.getByTestId(homeIds.chooseActivitySectionTitle)
        ).toBeInTheDocument();
        expect(screen.getByTestId(homeIds.chooseSelectors)).toBeInTheDocument();
        expect(screen.getByTestId(homeIds.chooseLists)).toBeInTheDocument();
        expect(screen.getByTestId(homeIds.manageActivitiesSection)).toBeInTheDocument();
        expect(
            screen.getByTestId(homeIds.manageActivitiesSectionTitle)
        ).toBeInTheDocument();
        expect(screen.getByTestId(homeIds.addActivity)).toBeInTheDocument();
        expect(screen.getByTestId(homeIds.editActivities)).toBeInTheDocument();
        expect(screen.getByTestId(homeIds.editCategories)).toBeInTheDocument();
        expect(screen.getByTestId(homeIds.account)).toBeInTheDocument();
    });
});
