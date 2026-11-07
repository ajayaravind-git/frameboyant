"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation" // ADDED: useRouter
import { addToCart } from "@lib/data/cart"

type OptionValue = { id: string; value: string }
type ProductOption = { id: string; title: string; values: OptionValue[] }
type ProductVariant = { id: string; title: string; options: { value: string }[] }

export default function HeroProductUI({ product }: { product: any }) {
    const params = useParams()
    const router = useRouter() // ADDED: Initialize router
    const countryCode = (params.countryCode as string) || "us"

    const defaultOptions: Record<string, string> = {}
    if (product.options) {
        product.options.forEach((opt: ProductOption) => {
            if (opt.values && opt.values.length > 0) {
                defaultOptions[opt.title] = opt.values[0].value
            }
        })
    }

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(defaultOptions)
    const [isAdding, setIsAdding] = useState(false)
    const [buttonText, setButtonText] = useState("Add to Cart")

    const handleSelect = (optionTitle: string, value: string) => {
        setSelectedOptions((prev) => ({ ...prev, [optionTitle]: value }))
        setButtonText("Add to Cart")
    }

    const selectedVariant = useMemo(() => {
        if (!product.variants || product.variants.length === 0) return null

        return product.variants.find((variant: ProductVariant) => {
            const variantOptionValues = variant.options.map(o => o.value)
            return Object.values(selectedOptions).every(val => variantOptionValues.includes(val))
        })
    }, [product.variants, selectedOptions])

    const handleAddToCart = async () => {
        if (!selectedVariant) return

        setIsAdding(true)
        setButtonText("Adding...")

        try {
            await addToCart({
                variantId: selectedVariant.id,
                quantity: 1,
                countryCode: countryCode,
            })

            setButtonText("Added!")

            // ADDED: Force Next.js to fetch the new cart data from the server
            router.refresh()

            window.dispatchEvent(new Event('open-cart'))
        } catch (error) {
            console.error("Cart Error:", error)
            setButtonText("Error")
        } finally {
            setIsAdding(false)
            setTimeout(() => setButtonText("Add to Cart"), 2000)
        }
    }

    return (
        <div className="flex flex-col items-center pointer-events-auto mt-8">
            {product.options?.map((option: ProductOption) => (
                <div key={option.id} className="flex flex-col items-center mb-6">
                    <span className="text-[#FDFDFF] font-bold uppercase tracking-widest mb-2 text-sm drop-shadow-md">
                        Select {option.title}
                    </span>
                    <div className="flex gap-3">
                        {option.values?.map((val) => {
                            const isSelected = selectedOptions[option.title] === val.value
                            return (
                                <button
                                    key={val.id}
                                    onClick={() => handleSelect(option.title, val.value)}
                                    className={`px-6 py-2 font-black uppercase text-sm border-2 transition-colors ${isSelected
                                        ? "bg-[#83FD80] border-[#83FD80] text-black"
                                        : "bg-black/50 border-[#83FD80] text-[#83FD80] hover:bg-[#83FD80]/20"
                                        }`}
                                >
                                    {val.value}
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}

            <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || isAdding}
                className={`mt-4 px-12 py-4 font-black text-xl uppercase tracking-widest transition-colors border-2 ${buttonText === "Added!"
                    ? "bg-[#83FD80] text-black border-[#83FD80]"
                    : "bg-[#F42902] text-[#FDFDFF] border-transparent hover:bg-white hover:text-[#F42902] hover:border-[#F42902]"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {buttonText}
            </button>
        </div>
    )
}