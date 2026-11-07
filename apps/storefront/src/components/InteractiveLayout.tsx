"use client"

import { ReactLenis } from '@studio-freight/react-lenis'

const Lenis = ReactLenis as any;

export default function InteractiveLayout({ children }: { children: React.ReactNode }) {
    return (
        <Lenis root>
            <div className="relative z-10 pointer-events-none">
                {children}
            </div>
        </Lenis>
    )
}