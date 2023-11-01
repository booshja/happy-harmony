"use client";

import { NavLinkStyled } from "./NavLinkStyled";

export interface NavLinkProps {
    href: string;
    path: string;
    clientId: string;
    children: string;
}

export const NavLink = ({ href, path, clientId, children }: NavLinkProps) => {
    const isRoot = path === "/";
    let isActive: boolean;

    if (isRoot) {
        isActive = path === href;
    } else {
        isActive = href.includes(path);
    }

    return (
        <NavLinkStyled href={href} $isActive={isActive} data-client-id={clientId}>
            {children}
        </NavLinkStyled>
    );
};
