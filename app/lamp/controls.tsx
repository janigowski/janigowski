"use client";

import { turn, setColor } from "@/services/hue";
import { useState, useCallback, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

const PRESETS = [
    { name: 'Lime', color: '#acdb00', className: 'bg-brand-lime/10 text-brand-lime hover:bg-brand-lime/20' },
    { name: 'Indigo', color: '#0078d4', className: 'bg-brand-indigo/10 text-brand-indigo hover:bg-brand-indigo/20' },
    { name: 'Olive', color: '#98a39c', className: 'bg-brand-olive/10 text-brand-olive hover:bg-brand-olive/20' },
    { name: 'Purple', color: '#1e1b4b', className: 'bg-brand-purple-dark/10 text-white hover:bg-brand-purple-dark/20' },
]

export default function Controls() {
    const [color, setLocalColor] = useState("#aabbcc");
    const [lastActionTime, setLastActionTime] = useState<{ [key: string]: number }>({});
    const throttleTimeout = useRef<NodeJS.Timeout | null>(null);
    const debounceTimeout = 500; // Increased to 500ms for power controls
    const throttleInterval = 250; // Color changes throttled to 250ms

    async function debouncedAction(key: string, action: () => Promise<void>) {
        const now = Date.now();
        const lastTime = lastActionTime[key] || 0;
        const timeSinceLastAction = now - lastTime;

        if (timeSinceLastAction < debounceTimeout) {
            await new Promise(resolve => setTimeout(resolve, debounceTimeout - timeSinceLastAction));
        }

        setLastActionTime(prev => ({ ...prev, [key]: Date.now() }));
        await action();
    }

    const throttledColorChange = useCallback((newColor: string) => {
        setLocalColor(newColor); // Update local state immediately for UI feedback

        if (throttleTimeout.current) {
            return; // If there's a pending timeout, skip this update
        }

        throttleTimeout.current = setTimeout(async () => {
            await setColor(newColor);
            throttleTimeout.current = null;
        }, throttleInterval);
    }, []);

    async function handleTurn(value: 'on' | 'off') {
        await debouncedAction('turn', () => turn(value));
    }

    function handleColorChange(newColor: string) {
        throttledColorChange(newColor);
    }

    // Cleanup throttle timeout on unmount
    useEffect(() => {
        return () => {
            if (throttleTimeout.current) {
                clearTimeout(throttleTimeout.current);
            }
        };
    }, []);

    return (
        <div className="mb-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-brand-purple-dark/5 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4">Power</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleTurn('on')}
                            className="px-4 py-2 bg-brand-lime/10 text-brand-lime rounded-md hover:bg-brand-lime/20 transition-colors"
                        >
                            Turn On
                        </button>
                        <button
                            onClick={() => handleTurn('off')}
                            className="px-4 py-2 bg-brand-olive/10 text-brand-olive rounded-md hover:bg-brand-olive/20 transition-colors"
                        >
                            Turn Off
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
                                className={`px-4 py-2 rounded-md transition-colors ${preset.className}`}
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-brand-purple-dark/5 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4">Custom Color</h3>
                    <div className="space-y-4">
                        <HexColorPicker
                            color={color}
                            onChange={handleColorChange}
                            className="!w-full"
                        />
                        <div className="flex justify-center">
                            <div
                                className="w-12 h-12 rounded-md"
                                style={{ backgroundColor: color }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
