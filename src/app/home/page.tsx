"use client";

import {
    TitleStyled,
    GreetingStyled,
    HomeGridStyled,
    HomePageStyled,
    HomeLinkGroupStyled,
    GroupTitleStyled,
    GroupListStyled,
    GroupListItemStyled,
    GroupListLinkStyled,
} from "./_pageStyled";
import { testingIds } from "../../helpers";

const userFirstName = "Jacob";

const homeIds = testingIds.pages.home;

export default function HomePage() {
    return (
        <HomePageStyled>
            <TitleStyled data-client-id={homeIds.title}>Home</TitleStyled>
            <GreetingStyled data-client-id={homeIds.greeting}>
                Hey there, {userFirstName}!
            </GreetingStyled>
            <HomeGridStyled>
                <HomeLinkGroupStyled data-client-id={homeIds.chooseActivitySection}>
                    <GroupTitleStyled
                        data-client-id={homeIds.chooseActivitySectionTitle}
                    >
                        Activities
                    </GroupTitleStyled>
                    <GroupListStyled>
                        <GroupListItemStyled>
                            <GroupListLinkStyled
                                href="/selectors"
                                data-client-id={homeIds.chooseSelectors}
                            >
                                Use the selectors
                            </GroupListLinkStyled>
                        </GroupListItemStyled>
                        <GroupListItemStyled>
                            <GroupListLinkStyled
                                href="/lists"
                                data-client-id={homeIds.chooseLists}
                            >
                                See your lists
                            </GroupListLinkStyled>
                        </GroupListItemStyled>
                    </GroupListStyled>
                </HomeLinkGroupStyled>
                <HomeLinkGroupStyled data-client-id={homeIds.manageActivitiesSection}>
                    <GroupTitleStyled
                        data-client-id={homeIds.manageActivitiesSectionTitle}
                    >
                        Manage
                    </GroupTitleStyled>
                    <GroupListStyled>
                        <GroupListItemStyled>
                            <GroupListLinkStyled
                                href="/activities/new"
                                data-client-id={homeIds.addActivity}
                            >
                                Add an activity
                            </GroupListLinkStyled>
                        </GroupListItemStyled>
                        <GroupListItemStyled>
                            <GroupListLinkStyled
                                href="/activities/edit"
                                data-client-id={homeIds.editActivities}
                            >
                                Edit your activities
                            </GroupListLinkStyled>
                        </GroupListItemStyled>
                        <GroupListItemStyled>
                            <GroupListLinkStyled
                                href="/categories/edit"
                                data-client-id={homeIds.editCategories}
                            >
                                Edit your categories
                            </GroupListLinkStyled>
                        </GroupListItemStyled>
                        <GroupListItemStyled>
                            <GroupListLinkStyled
                                href="/account"
                                data-client-id={homeIds.account}
                            >
                                Your account
                            </GroupListLinkStyled>
                        </GroupListItemStyled>
                    </GroupListStyled>
                </HomeLinkGroupStyled>
            </HomeGridStyled>
        </HomePageStyled>
    );
}
