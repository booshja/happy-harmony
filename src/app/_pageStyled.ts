"use client";

import styled from "@emotion/styled";

export const Page = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Title = styled.h1`
    font-size: 64px;
`;

export const Description = styled.p``;

export const HeroSection = styled.section`
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 16px;
    padding: 8px;
    border: 2px solid black;
    border-radius: 8px;
`;

export const HeroStep = styled.div`
    height: 200px;
    width: 200px;
    border: 2px solid black;
    border-radius: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
