import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import SessionExpiredModal from "@/app/components/SessionExpiredModal";
import React from "react";
import ErrorModal from "@/app/components/errorModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Event Sync",
  description: "Insert slogan",
viewport: "width=device-width, initial-scale=1",
lang: "en",
themeColor: "#000000",
favicon: "/favicon.ico",
    "og:title": "Event Sync",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " no-scrollbar h-full w-full bg-gray-100 dark:bg-black text-black dark:text-white"}>
      <Providers>
        {children}
          <SessionExpiredModal/>
          <ErrorModal/>
      </Providers>
      </body>
    </html>
  );
}
