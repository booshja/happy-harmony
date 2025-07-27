import type { Metadata } from "next";
import type { ReactNode } from "react";

import { inter } from "@/fonts/inter";
import { METADATA } from "@/utils/constants/metadata";

export const metadata: Metadata = METADATA;

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
    return (
        <html lang="en">
            <body className={`${inter.className}`}>{children}</body>
        </html>
    );
}
