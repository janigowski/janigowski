"use server";

import { remoteHue } from "./remoteHue";
import { RemoteHueLamp } from "./RemoteHueLamp";
import { Lamp, TurnValue } from "./types";

function createLamp(): Lamp {
    return new RemoteHueLamp(remoteHue);
}

const lamp: Lamp = createLamp();

export async function turn(value: TurnValue) {
    await lamp.turn(value);
}

export async function setColor(hexColor: string) {
    await lamp.setColor(hexColor);
}