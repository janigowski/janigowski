'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

type Stats = {
    total: number;
    completionRate: number;
    mostReadCategory: string;
    read: number;
    reading: number;
    waiting: number;
};

type StatCardProps = {
    value: number | string;
    label: string;
    color: string;
    textColor: string;
    labelColor: string;
    index: number;
    suffix?: string;
};

const FADE_DURATION = 0.6;
const STAGGER_DELAY = 0.15;
const COUNT_DURATION = 1.5;

const StatCard = ({ value, label, color, textColor, labelColor, index, suffix }: StatCardProps) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

    const renderValue = () => {
        if (typeof value === 'number') {
            return isInView && (
                <CountUp
                    from={0}
                    to={value}
                    duration={COUNT_DURATION}
                    delay={index * STAGGER_DELAY}
                    suffix={suffix}
                />
            );
        }

        // Handle "Category (number)" format
        if (typeof value === 'string' && value.includes('(')) {
            const [category, numberPart] = value.split('(');
            const number = parseInt(numberPart);

            return (
                <>
                    {category}(
                    {isInView && (
                        <CountUp
                            from={0}
                            to={number}
                            duration={COUNT_DURATION}
                            delay={index * STAGGER_DELAY}
                        />
                    )}
                    )
                </>
            );
        }

        return value;
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
                duration: FADE_DURATION,
                delay: index * STAGGER_DELAY,
                ease: 'easeOut'
            }}
            className={`relative rounded-2xl ${color} p-8 h-40 flex flex-col justify-between`}
        >
            <div className="flex-1 flex items-start">
                <motion.span
                    className={`${typeof value === 'number' ? 'text-6xl' : 'text-3xl'} font-medium ${textColor} line-clamp-2`}
                >
                    {renderValue()}
                </motion.span>
            </div>
            <div>
                <span className={`text-base font-medium ${labelColor}`}>{label}</span>
            </div>
        </motion.div>
    );
};

const CountUp = ({
    from,
    to,
    duration,
    delay = 0,
    suffix
}: {
    from: number;
    to: number;
    duration: number;
    delay?: number;
    suffix?: string;
}) => {
    const number = useMotionValue(from);
    const rounded = useTransform(number, (value: number) => Math.round(value));
    const [displayNumber, setDisplayNumber] = useState(from);

    useEffect(() => {
        const controls = animate(number, to, {
            duration,
            delay,
            ease: [0.32, 0.72, 0, 1], // Custom easing for smoother count
            onUpdate: () => setDisplayNumber(rounded.get())
        });
        return controls.stop;
    }, [from, to, duration, delay, number, rounded]);

    return <>{displayNumber}{suffix}</>;
};

export function LibraryStats({ stats }: { stats: Stats }) {
    const cards = [
        {
            value: stats.total,
            label: 'Total Books',
            color: 'bg-brand-purple-dark/5',
            textColor: 'text-white',
            labelColor: 'text-white/15'
        },
        {
            value: stats.completionRate,
            label: 'Completion Rate',
            color: 'bg-brand-purple-dark/5',
            textColor: 'text-white',
            labelColor: 'text-white/15',
            suffix: '%'
        },
        {
            value: stats.mostReadCategory,
            label: 'Most Read Category',
            color: 'bg-brand-purple-dark/5',
            textColor: 'text-white',
            labelColor: 'text-white/15'
        },
        {
            value: stats.read,
            label: 'Read',
            color: 'bg-brand-lime/5',
            textColor: 'text-brand-lime',
            labelColor: 'text-brand-lime/15'
        },
        {
            value: stats.reading,
            label: 'Reading',
            color: 'bg-brand-indigo/5',
            textColor: 'text-brand-indigo',
            labelColor: 'text-brand-indigo/60'
        },
        {
            value: stats.waiting,
            label: 'Waiting',
            color: 'bg-brand-olive/5',
            textColor: 'text-brand-olive',
            labelColor: 'text-brand-olive/50'
        },
    ];

    return (
        <div className="relative mb-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {cards.map((card, index) => (
                    <StatCard
                        key={card.label}
                        value={card.value}
                        label={card.label}
                        color={card.color}
                        textColor={card.textColor}
                        labelColor={card.labelColor}
                        index={index}
                        suffix={card.suffix}
                    />
                ))}
            </div>
        </div>
    );
} 