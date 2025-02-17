import { RemoteHue } from "./remoteHue";
import { Lamp, TurnValue } from "./types";

export class RemoteHueLamp implements Lamp {
    id: string;

    constructor(private readonly hue: RemoteHue) {
        this.id = '2f6e9529-e67e-4242-81c3-8a2b4f637cc0';
    }

    async setColor(hexColor: string) {
        await this.hue.setColor(this.id, hexColor)
    }

    async turn(value: TurnValue) {
        await this.hue.toggleLight(this.id, value === 'on')
    }
}