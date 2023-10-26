import { LandingPageStyled, LandingPageGridStyled } from "./LandingPageStyled";

export default function LandingPage() {
    return (
        <LandingPageStyled>
            <h1>Happy Harmony</h1>
            <p>An app to help you manage and choose pleasurable activities</p>
            <LandingPageGridStyled>
                <article>
                    <h3>Step 1</h3>
                    <p>Choose a category</p>
                </article>
                <article>
                    <h3>Step 2</h3>
                    <p>Choose a time</p>
                </article>
                <article>
                    <h3>Step 3</h3>
                    <p>Enjoy your activity!</p>
                </article>
            </LandingPageGridStyled>
        </LandingPageStyled>
    );
}
