"use client";

import { turn, setColor } from "@/services/hue";

export default function Controls() {
    return (
        <>
            <button onClick={() => turn('on')}>Turn on</button>
            <button onClick={() => turn('off')}>Turn off</button>
            <button onClick={() => setColor('#acdb00')}>Set color Acidlime</button>
            <button onClick={() => setColor('#0078d4')}>Set color Blue</button>
        </>

    );
}
