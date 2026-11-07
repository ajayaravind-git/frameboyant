"use client"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-6">
      <h2 className="text-3xl md:text-4xl font-medium tracking-normal text-black">
        Summary
      </h2>

      <div className="border-t-[4px] border-black pt-6">
        <DiscountCode cart={cart} />
      </div>

      <div className="border-t-[4px] border-black pt-6 mb-4">
        <CartTotals totals={cart} />
      </div>

      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
        className="w-full"
      >
        <button className="w-full bg-[#F42902] text-[#FDFDFF] text-2xl font-black uppercase py-4 border-[4px] border-black shadow-[6px_6px_0px_#111] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#111] active:translate-y-1 active:shadow-[0px_0px_0px_#111] transition-all">
          Go to Checkout
        </button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary