import Link from "next/link";
import styled from "styled-components";

const HeaderStyled = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 24px;
`;

const NavListStyled = styled.ul`
    display: flex;
    align-items: center;
    gap: 24px;
    list-style: none;
`;

const NavLogoStyled = styled(Link)`
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 600;
    color: #000000;
`;

const LogOutButtonStyled = styled.button`
    border: none;
    background: transparent;
    cursor: pointer;
    color: #000000;
`;

export { HeaderStyled, LogOutButtonStyled, NavListStyled, NavLogoStyled };
