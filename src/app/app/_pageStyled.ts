"use client";
import styled from "@emotion/styled";

export const Page = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-inline: 32px;
`;

export const Greeting = styled.h1`
    align-self: flex-start;
`;

export const MenuBoxes = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 60%;
`;

export const HomeBox = styled.section`
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
`;

export const BoxHeader = styled.h2``;
