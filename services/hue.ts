"use server";

export async function turn(value: 'on' | 'off') {
    console.log('HUE: Turning', value);
}