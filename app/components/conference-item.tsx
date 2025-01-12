import React from 'react'

interface ConferenceItemProps {
    date: string
    place: string
    conference: string
    children: React.ReactNode
}

export default function ConferenceItem({ date, place, conference, children }: ConferenceItemProps) {
    return (
        <>
            {/* Mobile Layout */}
            <div className="group relative sm:hidden py-12 first:pt-0">
                <time className="text-zinc-500 transition group-hover:text-zinc-300 text-sm">
                    {date}
                </time>
                <h3 className="mt-3 text-xl font-medium text-zinc-200 transition group-hover:text-white">
                    {children}
                </h3>
                <div className="flex flex-col gap-1 mt-2 text-sm">
                    <span className="text-zinc-400 transition group-hover:text-zinc-300">
                        {place}
                    </span>
                    <span className="text-zinc-400 transition group-hover:text-zinc-300">
                        {conference}
                    </span>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="group relative hidden sm:grid sm:grid-cols-[100px_1fr] sm:gap-8 py-12 first:pt-0">
                <time className="text-zinc-500 transition group-hover:text-zinc-300 text-sm">
                    {date}
                </time>
                <div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-zinc-400 transition group-hover:text-zinc-300">
                            {place}
                        </span>
                        <span className="h-[1px] w-12 bg-zinc-700 transition group-hover:bg-zinc-600" />
                        <span className="text-zinc-400 transition group-hover:text-zinc-300">
                            {conference}
                        </span>
                    </div>
                    <h3 className="mt-3 text-xl font-medium text-zinc-200 transition group-hover:text-white">
                        {children}
                    </h3>
                </div>
            </div>
        </>
    )
} 