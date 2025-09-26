import type { Metadata } from "next";

import "./globals.css";

import NavbarServer from "@/components/NavbarServer";

export const metadata: Metadata = {
    title: "Search-Transcripts-Archive",
    description: "ISDS Transcription Website",
    icons: {
        // icon: "/chakra-white.png",
        // shortcut: "/chakra-white.png",
        icon: "/image.ico",
        shortcut: "/image.ico",
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="light" >
            <body
                className="mx-auto  px-4 max-w-7xl min items-center align-middle">
                <section className="bg-bannerImg"></section>
                <div className="flex justify-center">
                    <NavbarServer  ></NavbarServer>
                </div>
                <main className="pt-20">
                    {children}
                </main>
            </body>
        </html>
    );
}
