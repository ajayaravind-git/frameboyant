"use client"

import { useState, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"

type Props = {
    product: HttpTypes.StoreProduct
    region: HttpTypes.StoreRegion
}

export default function BrutalistProductUI({ product, region }: Props) {
    const countryCode = useParams().countryCode as string

    // State for Image Gallery (Updated to use Index for Carousel logic)
    const images = product.images || []
    const [activeIndex, setActiveIndex] = useState(0)
    const activeImage = images.length > 0 ? images[activeIndex]?.url : product.thumbnail

    const nextImage = () => {
        setActiveIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    // State for Variants (e.g., Size, Color)
    const [options, setOptions] = useState<Record<string, string>>(() => {
        const initialOptions: Record<string, string> = {}
        product.options?.forEach((opt) => {
            if (opt.id && opt.values && opt.values.length > 0) {
                initialOptions[opt.id] = opt.values[0].value
            }
        })
        return initialOptions
    })

    // Find the variant that matches the currently selected options
    const selectedVariant = useMemo(() => {
        if (!product.variants || product.variants.length === 0) return null

        return product.variants.find((variant) => {
            return variant.options?.every((variantOpt) => {
                if (!variantOpt.option_id) return false
                return options[variantOpt.option_id] === variantOpt.value
            })
        })
    }, [product.variants, options])

    // Get Price from the selected variant
    const price = selectedVariant?.calculated_price?.calculated_amount
        ? (selectedVariant.calculated_price.calculated_amount).toFixed(2)
        : "---"

    const updateOption = (optionId: string, value: string) => {
        setOptions((prev) => ({ ...prev, [optionId]: value }))
    }

    return (
        // SCALED DOWN: Reduced gap between columns (gap-12 to gap-8)
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">

            {/* LEFT COLUMN: Sticky Image Viewer & Gallery */}
            <div className="w-full lg:w-1/2">
                <div className="sticky top-28 flex flex-col gap-4">

                    {/* Main Image Viewer with Carousel */}
                    {/* SCALED DOWN: Border 6px to 4px, Padding reduced */}
                    <div className="relative border-[4px] border-black bg-black/5 aspect-[4/5] w-full flex items-center justify-center p-4 md:p-6 group">
                        {activeImage ? (
                            <img
                                src={activeImage}
                                alt={product.title}
                                // SCALED DOWN: Drop shadow reduced slightly
                                className="w-full h-full object-contain drop-shadow-[8px_8px_0px_rgba(0,0,0,0.2)]"
                            />
                        ) : (
                            <span className="font-black text-3xl uppercase opacity-20">No Image</span>
                        )}

                        {/* Carousel Arrows (Only show if multiple images exist) */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#FDFDFF] border-[3px] border-black text-black px-3 py-2 text-2xl font-black hover:bg-[#83FD80] hover:-translate-x-1 shadow-[4px_4px_0px_#111] transition-all opacity-0 group-hover:opacity-100"
                                >
                                    ⟨
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FDFDFF] border-[3px] border-black text-black px-3 py-2 text-2xl font-black hover:bg-[#83FD80] hover:translate-x-1 shadow-[4px_4px_0px_#111] transition-all opacity-0 group-hover:opacity-100"
                                >
                                    ⟩
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Grid (Kept as indicators, but reduced border) */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 md:grid-cols-5 gap-2 mt-1">
                            {images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`aspect-square border-[2px] border-black bg-[#FDFDFF] p-1 transition-all ${activeIndex === idx ? 'bg-[#83FD80] shadow-[3px_3px_0px_#111] -translate-y-1' : 'hover:-translate-y-1 hover:shadow-[3px_3px_0px_#111]'}`}
                                >
                                    <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: Dynamic Details & Cart Actions */}
            <div className="w-full lg:w-1/2 flex flex-col justify-start pb-24">

                {/* SCALED DOWN: Title text size reduced */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-black leading-[0.9]">
                    {product.title}
                </h1>

                {/* SCALED DOWN: Subtitle size and left-border reduced */}
                <p className="mt-4 text-lg md:text-xl font-bold uppercase tracking-widest text-[#F42902] border-l-[4px] border-[#F42902] pl-3">
                    {product.subtitle || "Photo Frame"}
                </p>

                {/* Dynamic Price */}
                {/* SCALED DOWN: Top margin and text size reduced */}
                <div className="mt-6 pt-6 border-t-[3px] border-black">
                    <span className="text-4xl font-black tracking-tighter">
                        {region.currency_code.toUpperCase()} {price}
                    </span>
                </div>

                {product.description && (
                    <div className="mt-6 border-t-[3px] border-black pt-6">
                        <p className="text-base font-bold leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                )}

                {/* Dynamic Variants Generator */}
                {product.options && product.options.map((option) => {
                    if (!option.id) return null

                    return (
                        <div key={option.id} className="mt-6 border-t-[3px] border-black pt-6">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">{option.title}</h3>
                            <div className="flex flex-wrap gap-3">
                                {option.values?.map((val) => {
                                    if (!val.value) return null
                                    const isSelected = options[option.id] === val.value

                                    return (
                                        <button
                                            key={val.id}
                                            onClick={() => option.id && val.value && updateOption(option.id, val.value)}
                                            // SCALED DOWN: Padding and border reduced for variant pills
                                            className={`py-2 px-5 border-[2px] border-black font-black uppercase tracking-widest transition-all ${isSelected ? 'bg-[#83FD80] shadow-[4px_4px_0px_#111] -translate-y-0.5' : 'bg-[#FDFDFF] hover:bg-[#83FD80] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111]'}`}
                                        >
                                            {val.value}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}

                {/* Add to Cart Button */}
                {/* SCALED DOWN: Py-6 instead of py-8, border 4px instead of 6px, shadow reduced */}
                <div className="mt-8 pt-6">
                    <button
                        disabled={!selectedVariant}
                        className="w-full bg-[#F42902] text-[#FDFDFF] text-2xl md:text-4xl font-black uppercase py-6 border-[4px] border-black shadow-[8px_8px_0px_#111] hover:-translate-y-1.5 hover:shadow-[12px_12px_0px_#111] active:translate-y-1.5 active:shadow-[0px_0px_0px_#111] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        onClick={() => {
                            console.log("Add to Cart Payload:", {
                                variant_id: selectedVariant?.id,
                                quantity: 1,
                                countryCode
                            })
                        }}
                    >
                        {selectedVariant ? "Add To Cart" : "Out of Stock"}
                    </button>
                </div>

                {/* SCALED DOWN: Badges spacing reduced */}
                <div className="mt-6 flex flex-wrap gap-3">
                    <span className="bg-black text-[#83FD80] font-bold uppercase tracking-widest px-3 py-1.5 text-xs">
                        Free Global Shipping
                    </span>
                    <span className="bg-black text-[#FDFDFF] font-bold uppercase tracking-widest px-3 py-1.5 text-xs">
                        Heavy Duty Packaging
                    </span>
                </div>

            </div>
        </div>
    )
}