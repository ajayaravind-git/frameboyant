"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateLineItem, deleteLineItem } from "@lib/data/cart" // Medusa's cart actions

export default function CartDrawer({ cart }: { cart: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false) // Prevents spam-clicking
    const router = useRouter()

    // 1. Listen for open event
    useEffect(() => {
        const handleOpen = () => setIsOpen(true)
        window.addEventListener('open-cart', handleOpen)
        return () => window.removeEventListener('open-cart', handleOpen)
    }, [])

    // 2. Fix the Scroll Bleeding: Lock the body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        // Cleanup on unmount
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    // 3. Handle Quantity Changes
    const handleQuantity = async (lineId: string, newQuantity: number) => {
        if (newQuantity < 1) return
        setIsUpdating(true)
        try {
            await updateLineItem({ lineId, quantity: newQuantity })
            router.refresh() // Silently updates the cart data
        } catch (error) {
            console.error("Update failed:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    // 4. Handle Deletions
    const handleRemove = async (lineId: string) => {
        setIsUpdating(true)
        try {
            await deleteLineItem(lineId)
            router.refresh()
        } catch (error) {
            console.error("Remove failed:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <>
            {/* THE BACKDROP: Added pointer-events-auto to intercept clicks */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-[#FDFDFF]/50 backdrop-blur-md z-40 transition-opacity pointer-events-auto"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* THE DRAWER: Added pointer-events-auto to restore clickability */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#FDFDFF] border-l-[6px] border-black z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col pointer-events-auto ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className={`flex flex-col h-full ${isUpdating ? 'opacity-50 pointer-events-none' : ''} transition-opacity`}>

                    {/* Header */}
                    <div className="flex justify-between items-center p-6 md:p-8 border-b-[6px] border-black shrink-0">
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-black">
                            Cart
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-5xl font-black text-[#F42902] hover:text-[#83FD80] transition-colors leading-none cursor-pointer"
                        >
                            ×
                        </button>
                    </div>

                    {/* Cart Items Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {!cart || !cart.items || cart.items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <p className="text-xl font-bold text-black uppercase tracking-widest bg-[#83FD80] border-2 border-black px-4 py-1 shadow-[4px_4px_0px_#111]">
                                    Cart is empty
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {cart.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 border-b-[4px] border-black/10 pb-6">

                                        {/* Thumbnail */}
                                        <div className="w-24 h-32 relative bg-black/5 border-2 border-black shrink-0">
                                            {item.thumbnail && (
                                                <img src={item.thumbnail} alt={item.title} className="object-cover w-full h-full" />
                                            )}
                                        </div>

                                        {/* Item Details & Controls */}
                                        <div className="flex flex-col justify-center w-full">
                                            <h3 className="text-2xl font-black uppercase tracking-tighter text-black leading-none mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-[#F42902] font-bold uppercase text-sm tracking-widest mb-3">
                                                Size: {item.variant?.title}
                                            </p>

                                            {/* Quantity & Remove Interface */}
                                            <div className="flex items-center justify-between w-full">

                                                <div className="flex items-center border-2 border-black">
                                                    <button
                                                        onClick={() => handleQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="px-3 py-1 font-black hover:bg-[#83FD80] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3 font-black text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1 font-black hover:bg-[#83FD80] transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="text-xs font-black uppercase text-[#F42902] hover:text-black underline underline-offset-4"
                                                >
                                                    Remove
                                                </button>

                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Checkout Footer */}
                    <div className="border-t-[6px] border-black p-6 md:p-8 shrink-0 bg-[#FDFDFF]">
                        <a
                            href="/checkout"
                            className={`w-full flex justify-center py-4 text-[#FDFDFF] font-black text-2xl uppercase tracking-widest border-[4px] border-transparent transition-colors ${!cart?.items?.length
                                ? 'bg-black/20 pointer-events-none'
                                : 'bg-[#F42902] hover:bg-black hover:border-[#83FD80] hover:text-[#83FD80]'
                                }`}
                        >
                            Checkout
                        </a>
                    </div>

                </div>
            </div>
        </>
    )
}