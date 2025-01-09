import React from 'react'

interface KeywordProps {
    children: React.ReactNode
}

export function Keyword({ children }: KeywordProps) {
    return <span className="text-brand-lime">{children}</span>
} 