'use client';

import { useEffect, useState } from "react";

type Props = {
    image: string;
};

export function Background(props: Props) {
    const { image } = props;
    const mainColor = useMainColor(props.image);

    return (
        <div
            className="h-screen w-full bg-gradient-to-b from-zinc-900 via-[var(--main-color)] to-zinc-950"
            style={{ '--main-color': mainColor } as React.CSSProperties}
        />
    );
}

function useMainColor(src: string) {
    const [color, setColor] = useState('')

    useEffect(() => {
        async function assingColor() {
            const color = await getMainColor(src)

            if (color) {
                setColor(color)
            }
        }

        assingColor()
    }, [src])

    return color
}

export async function getMainColor(src: string) {
    const image = await loadImage(src)


    const canvas = new OffscreenCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')

    if (ctx) {
        let averageColor = [0, 0, 0]

        ctx.drawImage(image, 0, 0, image.width, image.height)
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < pixels.data.length; i += 4) {
            const r = pixels.data[i + 0]
            const g = pixels.data[i + 1]
            const b = pixels.data[i + 2]

            if (i === 20000) {
                averageColor[0] = r
                averageColor[1] = g
                averageColor[2] = b
            }
        }

        return '#' + averageColor[0].toString(16) + averageColor[1].toString(16) + averageColor[2].toString(16)
    }

}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (err) => reject(err));
        img.src = src;
    })
}