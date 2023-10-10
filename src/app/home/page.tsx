import Link from "next/link";

const userFirstName = "Jacob";

export default function HomePage() {
    return (
        <main>
            <h1>Home</h1>
            <p>Hey there, {userFirstName}</p>
            <section>
                <div>
                    <h2>Choose an activity</h2>
                    <ul>
                        <li>
                            <Link href="/selector">Use the selectors</Link>
                        </li>
                        <li>
                            <Link href="lists">See your lists</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2>Manage activities</h2>
                    <ul>
                        <li>
                            <Link href="/activities/new">Add an activity</Link>
                        </li>
                        <li>
                            <Link href="/activities/edit">Edit your activities</Link>
                        </li>
                        <li>
                            <Link href="/categories/edit">Edit your categories</Link>
                        </li>
                        <li>
                            <Link href="/account">Your account</Link>
                        </li>
                    </ul>
                </div>
            </section>
        </main>
    );
}
