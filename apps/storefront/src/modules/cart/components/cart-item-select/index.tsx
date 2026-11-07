"use client"

import {
  SelectHTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"

type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">

const CartItemSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ placeholder = "Select...", className, children, ...props }, ref) => {
    const innerRef = useRef<HTMLSelectElement>(null)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    return (
      <div className="relative">
        <select
          ref={innerRef}
          {...props}
          // Reduced border to 2px, font to bold, size to base, hover effect softened
          className={`appearance-none bg-transparent border-[2px] border-black text-black font-bold text-center text-base outline-none cursor-pointer hover:bg-black/5 transition-colors focus:ring-0 rounded-none ${className}`}
        >
          <option disabled value="">
            {placeholder}
          </option>
          {children}
        </select>
        {/* Shrunk the arrow and softened its weight */}
        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black font-bold text-xs md:text-sm">
          &#x25BC;
        </span>
      </div>
    )
  }
)

CartItemSelect.displayName = "CartItemSelect"

export default CartItemSelect