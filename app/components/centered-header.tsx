'use client'

import AnimatedTitle from './AnimatedTitle'
import { motion } from 'framer-motion'

interface CenteredHeaderProps {
    title: string
    description: string
}

export default function CenteredHeader({ title, description }: CenteredHeaderProps) {
    return (
        <header className="relative isolate overflow-hidden">
            <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <AnimatedTitle text={title} />
                        <motion.p
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.15 }}
                            className="mt-6 text-lg leading-8 text-zinc-400"
                        >
                            {description}
                        </motion.p>
                    </div>
                </div>
            </div>
        </header>
    )
} 