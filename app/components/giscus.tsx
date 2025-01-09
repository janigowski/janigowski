'use client'

import React, { useEffect, useRef } from 'react'

export function Giscus() {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!ref.current || typeof window === 'undefined') return

        const script = document.createElement('script')
        script.src = 'https://giscus.app/client.js'
        script.setAttribute('data-repo', 'janigowski/janigowski')
        script.setAttribute('data-repo-id', 'R_kgDOMOfovQ')
        script.setAttribute('data-category', 'Announcements')
        script.setAttribute('data-category-id', 'DIC_kwDOMOfovc4Cl4cb')
        script.setAttribute('data-mapping', 'pathname')
        script.setAttribute('data-strict', '0')
        script.setAttribute('data-reactions-enabled', '1')
        script.setAttribute('data-emit-metadata', '0')
        script.setAttribute('data-input-position', 'bottom')
        script.setAttribute('data-theme', `${window.location.origin}/api/giscus-theme`)
        script.setAttribute('data-lang', 'en')
        script.setAttribute('data-loading', 'lazy')
        script.crossOrigin = 'anonymous'
        script.async = true

        const container = ref.current
        container.appendChild(script)

        return () => {
            container.removeChild(script)
        }
    }, [])

    return <div ref={ref} />
} 