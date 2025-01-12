import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import SideBar from "@/components/Sidebar";
import StoreProvider from "@/app/StoreProvider";
import ToolBar from "@/components/ToolBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Management Tool",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <div className="relative flex flex-col sm:flex-row min-h-screen bg-white text-black">
            <SideBar />
            <div className="container mx-auto max-h-screen max-w-screen overflow-auto ">
              <ToolBar />
              {children}
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
