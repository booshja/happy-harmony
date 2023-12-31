import "./globals.css";
import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "../lib/registry";
import { Navbar } from "./_components";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Happy Harmony",
    description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <PlausibleProvider domain="happyharmony.dev" />
            </head>
            <UserProvider>
                <body className={inter.className}>
                    <StyledComponentsRegistry>
                        <Navbar />
                        {children}
                    </StyledComponentsRegistry>
                </body>
            </UserProvider>
        </html>
    );
}
