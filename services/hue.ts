"use server";

import { ConsoleLamp } from "./ConsoleLamp";
import { Lamp, TurnValue } from "./types";

function createLamp(): Lamp {
    return new ConsoleLamp();
}

const lamp: Lamp = createLamp();

export async function turn(value: TurnValue) {
    await lamp.turn(value);
}

export async function setColor(hexColor: string) {
    await lamp.setColor(hexColor);
}