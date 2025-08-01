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
                    <Link href="">Get a list</Link>
                    <Link href="">Get an activity</Link>
                    <Link href="">Browse your lists</Link>
                </HomeBox>
                <HomeBox>
                    <Link href="">Add an activity</Link>
                    <Link href="">Edit your activities</Link>
                    <Link href="">Edit your categories</Link>
                </HomeBox>
            </MenuBoxes>
        </Page>
    );
}
