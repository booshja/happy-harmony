"use client";

import Link from "next/link";
import styled from "styled-components";

interface NavLinkStyledProps {
    $isActive: boolean;
}

const NavLinkStyled = styled(Link)<NavLinkStyledProps>`
    text-decoration: ${({ $isActive }) => ($isActive ? "underline" : "none")};
    font-weight: ${({ $isActive }) => ($isActive ? "600" : "400")};
    color: #000000;

    &:hover {
        ${({ $isActive }) => (!$isActive ? "font-style: italic" : null)};
    }
`;

export { NavLinkStyled };
