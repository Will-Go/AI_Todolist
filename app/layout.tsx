import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Goin Todo It",
  description: "A modern, Todo List app powered by AI",

  authors: [{ name: "by Will-go" }],
};

import ReactQueryProvider from "./react-query-provider";
import AuthProvider from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 selection:bg-zinc-400 selection:text-zinc-900`}
      >
        <AuthProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
