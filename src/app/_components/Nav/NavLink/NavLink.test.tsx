import { screen, render } from "@testing-library/react";
import { NavLink } from "./";

describe("NavLink", () => {
    it("should render NavLink component", () => {
        render(
            <NavLink href="/test" path="/apples" clientId="nav-link">
                Testy test
            </NavLink>
        );

        expect(screen.getByText("Testy test")).toBeInTheDocument();

        const el = screen.getByTestId("nav-link");
        expect(el).toBeInTheDocument();
        expect(el.hasAttribute("href")).toBeTruthy();
        expect(el.hasAttribute("data-client-id")).toBeTruthy();

        expect(el).toHaveStyleRule("text-decoration", "none");
        expect(el).toHaveStyleRule("font-weight", "400");
    });

    it("renders NavLink component with active styling", () => {
        render(
            <NavLink href="/test" path="/test" clientId="nav-link">
                Testy test
            </NavLink>
        );

        expect(screen.getByTestId("nav-link")).toHaveStyleRule(
            "text-decoration",
            "underline"
        );
        expect(screen.getByTestId("nav-link")).toHaveStyleRule("font-weight", "600");
    });

    it("renders NavLink component with active styling when path is root", () => {
        render(
            <NavLink href="/" path="/" clientId="nav-link">
                Testy test
            </NavLink>
        );

        expect(screen.getByTestId("nav-link")).toHaveStyleRule(
            "text-decoration",
            "underline"
        );
        expect(screen.getByTestId("nav-link")).toHaveStyleRule("font-weight", "600");
    });
});
