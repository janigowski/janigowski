"use client";

import { turn, setColor } from "@/services/hue";
import { useState, useCallback, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useRouter } from "next/navigation";
import StaggeredAnimation from "../components/StaggeredAnimation";

const PRESETS = [
    // Warm colors
    {
        name: 'Warm White',
        color: '#FFB86C',
        className: 'bg-[#FFB86C]/10 text-[#FFB86C] hover:bg-[#FFB86C]/20 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    {
        name: 'Sunset',
        color: '#FF7F50',
        className: 'bg-[#FF7F50]/10 text-[#FF7F50] hover:bg-[#FF7F50]/20 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    {
        name: 'Peach',
        color: '#FFCBA4',
        className: 'bg-[#FFCBA4]/10 text-[#FFCBA4] hover:bg-[#FFCBA4]/20 disabled:opacity-50 disabled:cursor-not-allowed'
    },

    // Cool colors
    {
        name: 'Cool White',
        color: '#F0F8FF',
        className: 'bg-[#F0F8FF]/10 text-[#F0F8FF] hover:bg-[#F0F8FF]/20 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    {
        name: 'Arctic',
        color: '#E0FFFF',
        className: 'bg-[#E0FFFF]/10 text-[#E0FFFF] hover:bg-[#E0FFFF]/20 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    {
        name: 'Sky',
        color: '#87CEEB',
        className: 'bg-[#87CEEB]/10 text-[#87CEEB] hover:bg-[#87CEEB]/20 disabled:opacity-50 disabled:cursor-not-allowed'
    },

    // Vibrant colors
    {
        name: 'Lime',
        color: '#acdb00',
        className: 'bg-[#acdb00]/10 text-[#acdb00] hover:bg-[#acdb00]/20 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    {
        name: 'Deep Blue',
        color: '#0078d4',
        className: 'bg-[#0078d4]/10 text-[#0078d4] hover:bg-[#0078d4]/20 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    {
        name: 'Magenta',
        color: '#FF00FF',
        className: 'bg-[#FF00FF]/10 text-[#FF00FF] hover:bg-[#FF00FF]/20 disabled:opacity-50 disabled:cursor-not-allowed'
    },

    // Relaxing colors
    {
        name: 'Lavender',
        color: '#E6E6FA',
        className: 'bg-[#E6E6FA]/10 text-[#E6E6FA] hover:bg-[#E6E6FA]/20 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    {
        name: 'Mint',
        color: '#98FF98',
        className: 'bg-[#98FF98]/10 text-[#98FF98] hover:bg-[#98FF98]/20 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    {
        name: 'Rose',
        color: '#FFE4E1',
        className: 'bg-[#FFE4E1]/10 text-[#FFE4E1] hover:bg-[#FFE4E1]/20 disabled:opacity-50 disabled:cursor-not-allowed'
    },
]

export default function Controls() {
    const router = useRouter();
    const [color, setLocalColor] = useState("#aabbcc");
    const [isOn, setIsOn] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastActionTime, setLastActionTime] = useState<{ [key: string]: number }>({});
    const throttleTimeout = useRef<NodeJS.Timeout | null>(null);
    const debounceTimeout = 500;
    const throttleInterval = 250;

    async function debouncedAction(key: string, action: () => Promise<void>) {
        try {
            setIsLoading(true);
            setError(null);
            const now = Date.now();
            const lastTime = lastActionTime[key] || 0;
            const timeSinceLastAction = now - lastTime;

            if (timeSinceLastAction < debounceTimeout) {
                await new Promise(resolve => setTimeout(resolve, debounceTimeout - timeSinceLastAction));
            }

            setLastActionTime(prev => ({ ...prev, [key]: Date.now() }));
            await action();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    const throttledColorChange = useCallback((newColor: string) => {
        if (!isOn) return;
        setLocalColor(newColor);

        if (throttleTimeout.current) {
            return;
        }

        throttleTimeout.current = setTimeout(async () => {
            try {
                setError(null);
                await setColor(newColor);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error(err);
            } finally {
                throttleTimeout.current = null;
            }
        }, throttleInterval);
    }, [isOn]);

    async function handleTurn(value: 'on' | 'off') {
        await debouncedAction('turn', async () => {
            await turn(value);
            setIsOn(value === 'on');
        });
    }

    function handleColorChange(newColor: string) {
        throttledColorChange(newColor);
    }

    useEffect(() => {
        return () => {
            if (throttleTimeout.current) {
                clearTimeout(throttleTimeout.current);
            }
        };
    }, []);

    return (
        <div className="mb-32">
            {error && (
                <div className="mb-8 p-4 bg-red-500/10 text-red-500 rounded-lg text-center">
                    {error}
                    <button
                        onClick={() => router.refresh()}
                        className="ml-2 underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            <StaggeredAnimation className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" delay={0.3} staggerDelay={0.3} animationDuration={0.6}>
                <div className="bg-brand-purple-dark/5 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4">Power</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleTurn('on')}
                            disabled={isLoading || isOn}
                            className="px-4 py-2 bg-brand-lime/10 text-brand-lime rounded-md hover:bg-brand-lime/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Loading...' : 'Turn On'}
                        </button>
                        <button
                            onClick={() => handleTurn('off')}
                            disabled={isLoading || !isOn}
                            className="px-4 py-2 bg-brand-olive/10 text-brand-olive rounded-md hover:bg-brand-olive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Loading...' : 'Turn Off'}
                        </button>
                    </div>
                </div>

                <div className="bg-brand-purple-dark/5 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4">Presets</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {PRESETS.map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => handleColorChange(preset.color)}
                                disabled={!isOn || isLoading}
                                className={`px-4 py-2 rounded-md transition-colors ${preset.className}`}
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`bg-brand-purple-dark/5 p-6 rounded-lg transition-opacity ${!isOn ? 'opacity-50' : ''}`}>
                    <h3 className="text-lg font-medium text-white mb-4">Custom Color</h3>
                    <div className="space-y-4">
                        <div className={`${!isOn ? 'pointer-events-none' : ''}`}>
                            <HexColorPicker
                                color={color}
                                onChange={handleColorChange}
                                className="!w-full"
                            />
                        </div>
                        <div className="flex justify-center">
                            <div
                                className="w-12 h-12 rounded-md"
                                style={{ backgroundColor: color }}
                            />
                        </div>
                    </div>
                </div>
            </StaggeredAnimation>
        </div>
    );
}
