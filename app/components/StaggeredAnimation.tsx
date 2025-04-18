'use client';

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggeredAnimationProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    staggerDelay?: number;
    animationDuration?: number;
}

export default function StaggeredAnimation({
    children,
    className = "",
    delay = 0,
    staggerDelay = 0.15,
    animationDuration = 0.4
}: StaggeredAnimationProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
        >
            {Array.isArray(children) ? (
                children.map((child, index) => (
                    <motion.div
                        key={index}
                        variants={{
                            hidden: {
                                y: 5,
                                opacity: 0
                            },
                            visible: {
                                y: 0,
                                opacity: 1,

                                transition: {
                                    delay,
                                    ease: 'easeInOut',
                                    duration: animationDuration
                                }
                            }
                        }}
                    >
                        {child}
                    </motion.div>
                ))
            ) : (
                <motion.div
                    variants={{
                        hidden: {
                            y: 5,
                            opacity: 0
                        },
                        visible: {
                            y: 0,
                            opacity: 1,
                            transition: {
                                ease: 'easeInOut',
                                duration: animationDuration
                            }
                        }
                    }}
                >
                    {children}
                </motion.div>
            )}
        </motion.div>
    );
} 