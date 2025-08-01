import Link from "next/link";

import { BoxHeader, Greeting, HomeBox, MenuBoxes, Page } from "./_pageStyled";

export default function HomePage() {
    const userName = "Jacob";
    return (
        <Page>
            <Greeting>Hey there, {userName}!</Greeting>
            <MenuBoxes>
                <HomeBox>
                    <BoxHeader>Choose an activity</BoxHeader>
                    <Link href="/app/selector?type=list">Get a list</Link>
                    <Link href="/app/selector?type=single">Get an activity</Link>
                    <Link href="/app/activities">Browse your activities</Link>
                </HomeBox>
                <HomeBox>
                    <Link href="/app/activities/add">Add an activity</Link>
                    <Link href="/app/activities/edit">Edit your activities</Link>
                    <Link href="/app/categories/edit">Edit your categories</Link>
                </HomeBox>
            </MenuBoxes>
        </Page>
    );
}
