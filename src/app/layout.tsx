import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Footer } from "@/components/Footer/Footer";
import { Navbar } from "@/components/Navbar/Navbar";
import { inter } from "@/fonts/inter";
import { METADATA } from "@/utils/constants/metadata";

// eslint-disable-next-line no-restricted-imports
import "./globals.css";

export const metadata: Metadata = METADATA;

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
    return (
        <html lang="en">
            <body className={`${inter.className}`}>
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
