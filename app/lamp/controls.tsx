"use client";

import { turn, setColor } from "@/services/hue";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

export default function Controls() {
    const [color, setLocalColor] = useState("#aabbcc");

    function handleColorChange(color: string) {
        setColor(color);
    }

    return (
        <>
            <button onClick={() => turn('on')}>Turn on</button>
            <button onClick={() => turn('off')}>Turn off</button>
            <button onClick={() => setColor('#acdb00')}>Set color Acidlime</button>
            <button onClick={() => setColor('#0078d4')}>Set color Blue</button>
            <HexColorPicker color={color} onChange={handleColorChange} />
        </>

    );
}
