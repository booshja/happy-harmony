"use client";

import { usePathname } from "next/navigation";
import { testingIds } from "../../../../helpers";
import {
    HeaderStyled,
    LogOutButtonStyled,
    NavListStyled,
    NavLogoStyled,
} from "./NavbarStyled";
import { NavLink } from "../NavLink/NavLink";

interface NavbarProps {}

const navIds = testingIds.components.navbar;

export const Navbar = ({}: NavbarProps) => {
    const pathname = usePathname();

    return (
        <HeaderStyled>
            <NavLogoStyled href="/" data-client-id={navIds.logo}>
                Happy Harmony
            </NavLogoStyled>
            <nav>
                <NavListStyled data-client-id={navIds.list}>
                    <li data-client-id={navIds.listItem}>
                        <NavLink
                            href="/home"
                            path={pathname}
                            clientId={navIds.homeLink}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li data-client-id={navIds.listItem}>
                        <NavLink
                            href="/selectors"
                            path={pathname}
                            clientId={navIds.selectorsLink}
                        >
                            Selectors
                        </NavLink>
                    </li>
                    <li data-client-id={navIds.listItem}>
                        <NavLink
                            href="/account"
                            path={pathname}
                            clientId={navIds.accountLink}
                        >
                            Account
                        </NavLink>
                    </li>
                    <li data-client-id={navIds.listItem}>
                        <a href="/api/auth/login" data-clientid="">
                            Log In
                        </a>
                        {/* <LogOutButtonStyled data-client-id={navIds.logOutButton}>
                            Log out
                        </LogOutButtonStyled> */}
                        <a href="/api/auth/logout" data-clientid="">
                            Log out
                        </a>
                    </li>
                </NavListStyled>
            </nav>
        </HeaderStyled>
    );
};
