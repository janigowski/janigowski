import Link from 'next/link'
import React from 'react'

interface CallToActionProps {
    href: string
    children: React.ReactNode
}

export function CallToAction({ href, children }: CallToActionProps) {
    return (
        <Link href={href} className="text-brand-lime hover:text-brand-lime/80 transition-colors duration-200">
            {children} →
        </Link>
    )
} 