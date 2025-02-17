export interface Lamp {
    id: string;
    setColor: (hexColor: string) => Promise<void>;
    turn: (value: TurnValue) => Promise<void>;
}

export type TurnValue = 'on' | 'off';