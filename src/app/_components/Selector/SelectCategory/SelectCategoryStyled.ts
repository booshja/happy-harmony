"use client";

import styled from "styled-components";

const CategoryFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 400px;
`;

const CategoryFormSelectStyled = styled.select`
    border: 2px solid #000000;
    border-radius: 8px;
    padding: 8px;
`;

const CategoryFormInputLabelStyled = styled.label``;

const CategoryFormButtonStyled = styled.button`
    border: 2px solid #000000;
    border-radius: 8px;
    background-color: transparent;

    &:hover {
        background-color: #000000;
        color: #ffffff;
        cursor: pointer;
    }
`;

export {
    CategoryFormButtonStyled,
    CategoryFormInputLabelStyled,
    CategoryFormSelectStyled,
    CategoryFormStyled,
};
