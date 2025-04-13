'use client';

import { motion } from "framer-motion";
import { useMemo } from "react";

export default function AnimatedTitle({ text }: { text: string }) {
    const words = useMemo(() => text.split(" "), [text]);
    let index = 0;

    return (
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-7xl font-display">
            {words.map((word, i) => (
                <motion.span key={i} className="inline-block mr-8 break-keep">
                    {word.split("").map((c, j) => (
                        <motion.span
                            key={`${c}-${j}`}
                            className="inline-block"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                transition: {
                                    ease: "easeInOut",
                                    delay: index++ * 0.04,
                                    duration: 0.4,
                                },
                            }}
                        >
                            {c}
                        </motion.span>
                    ))}
                </motion.span>
            ))}
        </h1>
    );
}