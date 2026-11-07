import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-[#FDFDFF] relative min-h-screen">

      {/* Brutalist Checkout Navbar */}
      <nav className="flex items-center h-24 w-full border-b-[4px] border-black px-4 md:px-12 bg-black text-[#FDFDFF]">
        <div className="flex-1">
          <LocalizedClientLink
            href="/cart"
            className="text-xs md:text-sm font-bold uppercase tracking-widest hover:text-[#F42902] transition-colors bg-[#FDFDFF] text-black px-4 py-2 border-[2px] border-black shadow-[4px_4px_0px_#F42902]"
          >
            ← Back
          </LocalizedClientLink>
        </div>

        <div className="flex-1 flex justify-center">
          <LocalizedClientLink
            href="/"
            className="text-3xl md:text-4xl font-black uppercase tracking-tighter hover:text-[#83FD80] transition-colors"
          >
            FRAMEBOYANT.
          </LocalizedClientLink>
        </div>

        <div className="flex-1 flex justify-end">
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#83FD80]">
            Secure Server
          </span>
        </div>
      </nav>

      <div className="relative">{children}</div>
    </div>
  )
}