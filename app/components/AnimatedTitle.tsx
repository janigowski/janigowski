'use client';

import { motion } from "framer-motion";
import { useMemo } from "react";

export default function AnimatedTitle({ text }: { text: string }) {
    const words = useMemo(() => text.split(" "), [text]);
    let index = 0;

    return (
        <motion.h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-7xl font-display sm:leading-[1.5] bg-gradient-to-b from-white to-zinc-400 bg-clip-text"
            initial={{
                y: 5,
                opacity: 0
            }}
            animate={{
                y: 0,
                opacity: 1,
                transition: {
                    ease: 'easeInOut',
                    duration: 0.4
                }
            }}>
            {text}
        </motion.h1>
    );
}