import type { Metadata } from "next";

const WEBSITE_DESCRIPTION =
    "Keep track of and choose which pleasurable activities to do!";
const WEBSITE_NAME = "Happy Harmony";
const WEBSITE_AUTHOR_NAME = "Jacob Andes";
const WEBSITE_AUTHOR_EMAIL = "jacobandesdev@gmail.com";
const WEBSITE_AUTHOR_WEBSITE = "jacobandes.dev";
const WEBSITE_COMPOSITE_AUTHOR = `${WEBSITE_AUTHOR_NAME} ${WEBSITE_AUTHOR_EMAIL} ${WEBSITE_AUTHOR_WEBSITE}`;
const WEBSITE_URL = "https://happyharmony.dev";

export const METADATA: Metadata = {
    alternates: {
        canonical: WEBSITE_URL,
    },
    applicationName: WEBSITE_NAME,
    authors: {
        name: WEBSITE_AUTHOR_NAME,
        url: WEBSITE_AUTHOR_EMAIL,
    },
    creator: WEBSITE_COMPOSITE_AUTHOR,
    description: WEBSITE_DESCRIPTION,
    formatDetection: {
        address: false,
        date: false,
        email: true,
        telephone: false,
        url: true,
    },
    generator: "Next.js",
    // icons: [],
    keywords: ["therapy", "pleasurable activities", "harmony"],
    openGraph: {
        description: WEBSITE_DESCRIPTION,
        // images: [
        //     {
        //         alt: "",
        //         height: "",
        //         type: "",
        //         url: "",
        //         width: "",
        //     },
        // ],
        title: WEBSITE_NAME,
        type: "website",
        url: WEBSITE_URL,
    },
    title: WEBSITE_NAME,
    twitter: {
        card: "summary",
        description: WEBSITE_DESCRIPTION,
        // images: [
        //     {
        //         alt: "",
        //         height: "",
        //         url: "",
        //         width: "",
        //     },
        // ],
        title: WEBSITE_NAME,
    },
    // verification: {
    //     google: "",
    // },
};
