"use client";

import styled from "@emotion/styled";
import Link from "next/link";

export const Nav = styled.nav`
    height: 60px;
    width: 100%;
    padding: 0 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const LogoLink = styled(Link)`
    font-family: inherit;
`;

export const LinkContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`;

export const NavLink = styled(Link)`
    font-family: inherit;
`;
