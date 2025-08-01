import {
    FooterLink,
    FooterStyled,
    LinkContainer,
    LinkList,
    LinkListItem,
    LogoLink,
} from "./FooterStyled";

export const Footer = () => {
    const isUserLoggedIn = true;

    return (
        <FooterStyled>
            <LogoLink href={isUserLoggedIn ? "/app" : "/"}>Happy Harmony</LogoLink>
            <LinkContainer>
                <LinkList>
                    <LinkListItem>
                        <FooterLink href={isUserLoggedIn ? "/app" : "/"}>
                            Home
                        </FooterLink>
                    </LinkListItem>
                    <LinkListItem>
                        <FooterLink href="/app/selector">Choose an activity</FooterLink>
                    </LinkListItem>
                    <LinkListItem>
                        <FooterLink href="/app/activities">Activities</FooterLink>
                    </LinkListItem>
                    <LinkListItem>
                        <FooterLink href="/app/categories">Categories</FooterLink>
                    </LinkListItem>
                </LinkList>
                <LinkList>
                    <LinkListItem>
                        <FooterLink
                            href="https://www.psychologytoday.com/"
                            referrerPolicy="no-referrer"
                            target="blank"
                        >
                            Find a therapist
                        </FooterLink>
                    </LinkListItem>
                </LinkList>
            </LinkContainer>
        </FooterStyled>
    );
};
