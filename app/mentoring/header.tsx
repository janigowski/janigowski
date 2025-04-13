import React from "react";
import Balancer from "react-wrap-balancer";
import AnimatedTitle from "../components/AnimatedTitle";

export const Header: React.FC = () => {
    return (
        <header className="relative isolate overflow-hidden">
            <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <AnimatedTitle text="Mentoring" />
                        <p className="mt-6 text-lg leading-8 text-zinc-400">
                            <Balancer>Elevate your craft through personalized guidance and collaborative problem-solving</Balancer>
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}; 