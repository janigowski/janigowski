import { Lamp, TurnValue } from "./types";

export class ConsoleLamp implements Lamp {
    id: string;
    name: string;

    constructor() {
        this.id = 'console';
        this.name = 'Console Lamp';
    }

    async setColor(hexColor: string) {
        console.log('ConsoleLamp: Setting color', hexColor);
    }

    async turn(value: TurnValue) {
        console.log('ConsoleLamp: Turning', value);
    }


}