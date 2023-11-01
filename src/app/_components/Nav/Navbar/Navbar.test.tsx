import { render, screen } from "@testing-library/react";
import { Navbar } from "./";
import { testingIds } from "../../../../helpers";

const navIds = testingIds.components.navbar;

describe("Navbar", () => {
    it("should render all elements correctly for Navbar component", () => {
        render(<Navbar />);

        expect(screen.getByTestId(navIds.logo)).toBeInTheDocument();
        expect(screen.getByTestId(navIds.list)).toBeInTheDocument();
        expect(screen.getAllByTestId(navIds.listItem)).toHaveLength(4);
        expect(screen.getByTestId(navIds.homeLink)).toBeInTheDocument();
        expect(screen.getByTestId(navIds.selectorsLink)).toBeInTheDocument();
        expect(screen.getByTestId(navIds.accountLink)).toBeInTheDocument();
        expect(screen.getByTestId(navIds.logOutButton)).toBeInTheDocument();
    });
});
