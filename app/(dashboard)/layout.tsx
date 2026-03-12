"use client";

import Navbar from "@/components/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 64, minHeight: "100vh" }}>{children}</main>
        </>
    );
}
