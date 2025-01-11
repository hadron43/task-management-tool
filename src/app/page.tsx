"use client";

import SideBar from "@/components/Sidebar";
import StoreProvider from "@/app/StoreProvider";

export default function Home() {
  return (
    <StoreProvider>
      <div className="relative flex flex-col sm:flex-row min-h-screen bg-white text-black">
        <SideBar />
        <main className="flex-1 p-2 sm:p-8 container mx-auto">
          <div>Sample data</div>
        </main>
      </div>
    </StoreProvider>
  );
}
