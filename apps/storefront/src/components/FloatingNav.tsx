"use client"

export default function FloatingNav({ cart }: { cart: any }) {
    // Calculate total items (summing the quantity of all variants in the cart)
    const totalItems = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0

    return (
        <div className="fixed top-0 left-0 w-full p-4 md:p-8 flex justify-between items-start z-40 pointer-events-none">

            {/* Top Left: Logo */}
            <a
                href="/"
                className="pointer-events-auto text-xl md:text-2xl font-black uppercase tracking-tighter text-black bg-[#83FD80] border-2 border-black px-4 py-1 shadow-[4px_4px_0px_#111] hover:bg-black hover:text-[#83FD80] transition-colors"
            >
                FRAMEBOYANT.
            </a>

            {/* Top Right: Cart Toggle */}
            <button
                onClick={() => window.dispatchEvent(new Event('open-cart'))}
                className="pointer-events-auto text-lg md:text-xl font-black uppercase tracking-widest text-[#FDFDFF] bg-[#F42902] border-2 border-black px-4 py-1 shadow-[4px_4px_0px_#111] hover:bg-black hover:text-[#F42902] transition-colors flex items-center gap-2"
            >
                CART [{totalItems}]
            </button>

        </div>
    )
}