"use client";

import styled from "styled-components";

const SelectorWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
`;

const SelectorWrapperButtonsContainerStyled = styled.section`
    display: flex;
    gap: 16px;
    border-bottom: 2px solid #000000;
`;

const SelectorWrapperButtonStyled = styled.button`
    border: none;
    background: transparent;
    font-weight: 600;

    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;

export {
    SelectorWrapperButtonStyled,
    SelectorWrapperButtonsContainerStyled,
    SelectorWrapperStyled,
};
