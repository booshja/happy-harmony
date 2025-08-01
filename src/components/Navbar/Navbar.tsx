import { LinkContainer, LogoLink, Nav, NavLink } from "./NavbarStyled";

export const Navbar = () => {
    const isUserLoggedIn = true;

    return (
        <Nav>
            <LogoLink href={isUserLoggedIn ? "/app" : "/"}>Happy Harmony</LogoLink>
            <LinkContainer>
                {isUserLoggedIn ? (
                    <>
                        <NavLink href="/app">Home</NavLink>
                    </>
                ) : (
                    <></>
                )}
            </LinkContainer>
        </Nav>
    );
};
