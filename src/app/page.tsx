import { Description, HeroSection, HeroStep, Page, Title } from "./_pageStyled";

export default function LandingPage() {
    return (
        <Page>
            <Title>Happy Harmony</Title>
            <Description>
                From adventure to relaxation to self-care&hellip; Track and select the
                activities that nurture your soul
            </Description>
            <HeroSection>
                <HeroStep>1</HeroStep>
                <HeroStep>2</HeroStep>
                <HeroStep>3</HeroStep>
            </HeroSection>
        </Page>
    );
}
