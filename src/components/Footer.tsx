import styled from "@emotion/styled";
import { FOOTER_DISCLAIMER } from "@utils/constants/crisisResources";

const FooterWrapper = styled.footer`
    padding: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
`;

const Text = styled.p`
    font-size: 0.875rem;
    line-height: 1.35;
`;

const LinkRow = styled.div`
    margin-top: 8px;
`;

const Link = styled.a`
    font-size: 0.875rem;
`;

export function Footer() {
    return (
        <FooterWrapper aria-label="Safety disclaimer">
            {FOOTER_DISCLAIMER.lines.map((line) => (
                <Text key={line}>{line}</Text>
            ))}
            <LinkRow>
                <Link
                    href={FOOTER_DISCLAIMER.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {FOOTER_DISCLAIMER.linkText}
                </Link>
            </LinkRow>
        </FooterWrapper>
    );
}
