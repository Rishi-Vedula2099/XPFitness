"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const WorkoutContent = dynamic(() => import("./WorkoutContent"), {
    ssr: false,
    loading: () => <WorkoutSkeleton />,
});

function WorkoutSkeleton() {
    return (
        <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
            <div style={{ marginBottom: 28 }}>
                <div
                    className="shimmer"
                    style={{ width: 200, height: 16, borderRadius: 8, marginBottom: 10 }}
                />
                <div
                    className="shimmer"
                    style={{ width: 350, height: 32, borderRadius: 8, marginBottom: 10 }}
                />
                <div
                    className="shimmer"
                    style={{ width: 180, height: 14, borderRadius: 8 }}
                />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="shimmer"
                        style={{ width: 90, height: 40, borderRadius: 10 }}
                    />
                ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="shimmer"
                    style={{
                        height: 220,
                        borderRadius: 12,
                        marginBottom: 16,
                    }}
                />
            ))}
        </div>
    );
}

export default function WorkoutPage() {
    return (
        <Suspense fallback={<WorkoutSkeleton />}>
            <WorkoutContent />
        </Suspense>
    );
}
