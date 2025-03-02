import React from "react";

export const Header: React.FC = () => {
    return (
        <header className="relative isolate overflow-hidden">
            <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl font-display">
                            Experience
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-zinc-400">
                            A decade of building digital products and leading engineering teams
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}; 