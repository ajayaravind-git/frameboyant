"use client"

import { useState } from "react"
import Hero3D from "./Hero3D"
import HeroProductUI from "./HeroProductUI"

export default function HeroCarousel({ products }: { products: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextProduct = () => {
        setCurrentIndex((prev) => (prev + 1) % products.length)
    }

    const prevProduct = () => {
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
    }

    const currentProduct = products[currentIndex]
    const targetImage = currentProduct?.images?.[0]?.url || currentProduct?.thumbnail || ''

    return (
        // THE FIX: Increased the scroll track to 120vh (was h-screen)
        <div className="relative w-full h-[120vh] bg-[#FDFDFF]">

            {/* LAYER 1: TEXT BACKGROUND (Absolute) */}
            {/* This layer scrolls up naturally with the page, creating the parallax reveal */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-0 pointer-events-none px-4 overflow-hidden">
                <h1 className="text-[4.5rem] sm:text-[7rem] md:text-[10rem] leading-[0.85] font-black uppercase tracking-tighter text-black text-center w-full opacity-90 drop-shadow-sm">
                    {currentProduct.title}
                </h1>
            </div>

            {/* LAYER 2: STICKY 3D FRAME & UI */}
            {/* This layer locks to the viewport for the duration of the 120vh scroll */}
            <div className="sticky top-0 left-0 w-full h-screen z-10 pointer-events-none overflow-hidden">

                {/* The 3D Canvas */}
                <Hero3D imageUrl={targetImage} />

                {/* The UI Interface */}
                <div className="absolute inset-0 z-20 flex items-center justify-between px-2 md:px-12 pointer-events-none">

                    <button
                        onClick={prevProduct}
                        className="pointer-events-auto text-[#F42902] hover:text-[#83FD80] transition-colors text-6xl md:text-8xl font-black drop-shadow-md px-2"
                    >
                        ⟨
                    </button>

                    {/* Add to Cart Block (Pinned to bottom) */}
                    <div className="flex flex-col items-center justify-end h-full pb-[10vh] md:pb-[12vh]">
                        <p className="text-sm md:text-lg font-bold mb-4 text-black uppercase tracking-widest bg-[#83FD80] border-2 border-black px-6 py-1 shadow-[4px_4px_0px_#111] pointer-events-none">
                            {currentProduct.subtitle || "Premium Framed Art"}
                        </p>
                        <div className="pointer-events-auto scale-90 sm:scale-100">
                            <HeroProductUI product={currentProduct} />
                        </div>
                    </div>

                    <button
                        onClick={nextProduct}
                        className="pointer-events-auto text-[#F42902] hover:text-[#83FD80] transition-colors text-6xl md:text-8xl font-black drop-shadow-md px-2"
                    >
                        ⟩
                    </button>

                </div>

                {/* Pagination Tracker */}
                <div className="absolute bottom-6 md:bottom-8 w-full flex justify-center gap-2 md:gap-3 z-30 pointer-events-none">
                    {products.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 md:h-2 transition-all duration-300 ${idx === currentIndex ? 'w-8 md:w-12 bg-[#F42902]' : 'w-3 md:w-4 bg-black/20'} `}
                        />
                    ))}
                </div>

            </div>
        </div>
    )
}