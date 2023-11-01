"use client";

import styled from "styled-components";
import Link from "next/link";

const HomePageStyled = styled.main`
    display: flex;
    flex-direction: column;
    padding: 24px;
`;

const TitleStyled = styled.h1``;

const GreetingStyled = styled.p``;

const HomeGridStyled = styled.section`
    display: flex;
    gap: 32px;
    padding-top: 32px;
    padding-left: 32px;
`;

const HomeLinkGroupStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 2px solid #000000;
    border-radius: 8px;
    padding: 16px;
`;

const GroupTitleStyled = styled.h2``;

const GroupListStyled = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 8px;
    list-style: none;
    padding: 0 8px 0 16px;
    min-width: 180px;
`;

const GroupListItemStyled = styled.li``;

const GroupListLinkStyled = styled(Link)`
    text-decoration: none;
    color: #000000;

    &:hover {
        text-decoration: underline;
        font-weight: 600;
    }
`;

export {
    TitleStyled,
    GreetingStyled,
    HomePageStyled,
    HomeGridStyled,
    HomeLinkGroupStyled,
    GroupTitleStyled,
    GroupListStyled,
    GroupListItemStyled,
    GroupListLinkStyled,
};
