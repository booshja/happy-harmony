import { LinkContainer, LogoLink, Nav, NavLink } from "./NavbarStyled";

export const Navbar = () => {
    return (
        <Nav>
            <LogoLink href="/">Happy Harmony</LogoLink>
            <LinkContainer>
                <NavLink href="/app">Home</NavLink>
            </LinkContainer>
        </Nav>
    );
};
