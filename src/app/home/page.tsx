import Link from "next/link";
import { testingIds } from "../../helpers";

const userFirstName = "Jacob";

const homeIds = testingIds.pages.home;

export default function HomePage() {
    return (
        <main>
            <h1 data-client-id={homeIds.title}>Home</h1>
            <p data-client-id={homeIds.greeting}>Hey there, {userFirstName}</p>
            <section>
                <div data-client-id={homeIds.chooseActivitySection}>
                    <h2 data-client-id={homeIds.chooseActivitySectionTitle}>
                        Choose an activity
                    </h2>
                    <ul>
                        <li>
                            <Link
                                href="/selector"
                                data-client-id={homeIds.chooseSelectors}
                            >
                                Use the selectors
                            </Link>
                        </li>
                        <li>
                            <Link href="/lists" data-client-id={homeIds.chooseLists}>
                                See your lists
                            </Link>
                        </li>
                    </ul>
                </div>
                <div data-client-id={homeIds.manageActivitiesSection}>
                    <h2 data-client-id={homeIds.manageActivitiesSectionTitle}>
                        Manage activities
                    </h2>
                    <ul>
                        <li>
                            <Link
                                href="/activities/new"
                                data-client-id={homeIds.addActivity}
                            >
                                Add an activity
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/activities/edit"
                                data-client-id={homeIds.editActivities}
                            >
                                Edit your activities
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/categories/edit"
                                data-client-id={homeIds.editCategories}
                            >
                                Edit your categories
                            </Link>
                        </li>
                        <li>
                            <Link href="/account" data-client-id={homeIds.account}>
                                Your account
                            </Link>
                        </li>
                    </ul>
                </div>
            </section>
        </main>
    );
}
