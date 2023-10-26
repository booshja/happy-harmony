import { testingIds } from "../helpers";
import { LandingPageStyled, LandingPageGridStyled } from "./LandingPageStyled";

const landingIds = testingIds.pages.landing;

export default function LandingPage() {
    return (
        <LandingPageStyled>
            <h1 data-client-id={landingIds.title}>Happy Harmony</h1>
            <p data-client-id={landingIds.description}>
                An app to help you manage and choose pleasurable activities
            </p>
            <LandingPageGridStyled data-client-id={landingIds.grid}>
                <article data-client-id={landingIds.gridItem}>
                    <h3 data-client-id={landingIds.gridItemTitle}>Step 1</h3>
                    <p data-client-id={landingIds.gridItemDescription}>
                        Choose a category
                    </p>
                </article>
                <article data-client-id={landingIds.gridItem}>
                    <h3 data-client-id={landingIds.gridItemTitle}>Step 2</h3>
                    <p data-client-id={landingIds.gridItemDescription}>Choose a time</p>
                </article>
                <article data-client-id={landingIds.gridItem}>
                    <h3 data-client-id={landingIds.gridItemTitle}>Step 3</h3>
                    <p data-client-id={landingIds.gridItemDescription}>
                        Enjoy your activity!
                    </p>
                </article>
            </LandingPageGridStyled>
        </LandingPageStyled>
    );
}
