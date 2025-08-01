"use client";

import styled from "@emotion/styled";
import Link from "next/link";

export const FooterStyled = styled.footer`
    border-top: 1px solid black;
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
    padding: 64px;
    height: 250px;
`;

export const LogoLink = styled(Link)``;

export const LinkContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 32px;
`;

export const LinkList = styled.ul`
    list-style-type: none;
    display: flex;
    flex-direction: column;
    padding: 0;
    gap: 8px;
`;

export const LinkListItem = styled.li``;

export const FooterLink = styled(Link)``;
