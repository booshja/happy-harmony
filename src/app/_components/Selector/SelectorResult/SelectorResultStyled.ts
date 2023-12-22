"use client";

import styled from "styled-components";

const ResultContainerStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 400px;
`;

const ResultActivityTextStyled = styled.p``;

const ResultActivityTextSpanStyled = styled.span`
    font-weight: 600;
`;

const ResultListStyled = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 16px;
    list-style: none;
`;

const ResultActivityButtonStyled = styled.button`
    border: 2px solid #000000;
    border-radius: 8px;
    background-color: transparent;

    &:hover {
        background-color: #000000;
        color: #ffffff;
        cursor: pointer;
    }
`;

const SingleResultContainerStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export {
    ResultActivityButtonStyled,
    ResultActivityTextSpanStyled,
    ResultActivityTextStyled,
    ResultContainerStyled,
    ResultListStyled,
    SingleResultContainerStyled,
};
