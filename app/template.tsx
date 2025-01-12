"use client";
import { Navigation } from "./components/nav";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navigation />
            <div className="animate-page-transition">
                {children}
            </div>
        </>
    );
} 