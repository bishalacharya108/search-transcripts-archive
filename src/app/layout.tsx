import type { Metadata } from "next";

import "./globals.css";

import NavbarServer from "@/components/NavbarServer";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Search-Transcripts-Archive",
    description: "ISDS Transcription Website",
    icons: {
        icon: "/chakra.ico",
        shortcut: "/chakra.ico",
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="light">
            <body
                className="mx-auto  px-4 max-w-7xl min items-center align-middle">
                <section className="bg-gradient-to-b from-[#FADD76] to-white fixed inset-0 w-full h-[112vh] z-[-10] bg-no-repeat bg-cover align-middle items-center bg-center "></section>
                <section className="bg-bannerImg"></section>
                <div className="flex justify-center">
                    <Suspense fallback={<div className="h-16 bg-base-100 shadow-sm" />}>
                        <NavbarServer ></NavbarServer>
                    </Suspense>
                </div>
                <main className="pt-20">
                    {children}
                </main>
            </body>
        </html>
    );
}
