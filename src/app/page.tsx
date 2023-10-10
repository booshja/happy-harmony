import styles from "./page.module.css";

export default function LandingPage() {
    return (
        <main style={{ display: "flex", flexDirection: "column" }}>
            <h1>Happy Harmony</h1>
            <p>An app to help you manage and choose pleasurable activities</p>
            <div style={{ border: "1px solid black", borderRadius: "6px", display: "flex", padding: "16px" }}>
                <article className={styles.stepCard}>
                    <h3>Step 1</h3>
                    <p>Choose a category</p>
                </article>
                <article className={styles.stepCard}>
                    <h3>Step 2</h3>
                    <p>Choose a time</p>
                </article>
                <article className={styles.stepCard}>
                    <h3>Step 3</h3>
                    <p>Enjoy your activity!</p>
                </article>
            </div>
        </main>
    );
}
