"use client";

import { turn } from "@/services/hue";

export default function Controls() {
    return (
        <>
            <button onClick={() => turn('on')}>Turn on</button>
            <button onClick={() => turn('off')}>Turn off</button>
        </>

    );
}
