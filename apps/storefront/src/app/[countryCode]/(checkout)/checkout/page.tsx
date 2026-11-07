import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout | LOUD ART.",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <main className="min-h-screen bg-[#FDFDFF] pt-24 md:pt-28 pb-24 px-4 md:px-12">

      {/* Brutalist Checkout Header */}
      <div className="mb-8 md:mb-12 border-b-[4px] border-black pb-6">
        <h1 className="text-5xl sm:text-6xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
          Secure Checkout
        </h1>
        <p className="mt-4 text-lg md:text-xl font-bold uppercase tracking-widest text-[#F42902] border-l-[4px] border-[#F42902] pl-3">
          Finalize Your Order
        </p>
      </div>

      {/* Massive 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 md:gap-12 relative">

        {/* LEFT COLUMN: The Forms */}
        <div className="flex flex-col gap-8">
          <PaymentWrapper cart={cart}>
            <CheckoutForm cart={cart} customer={customer} />
          </PaymentWrapper>
        </div>

        {/* RIGHT COLUMN: Sticky Receipt */}
        <div className="w-full relative">
          <div className="lg:sticky lg:top-32 border-[4px] border-black bg-[#FDFDFF] p-6 shadow-[8px_8px_0px_#111]">
            <CheckoutSummary cart={cart} />
          </div>
        </div>

      </div>
    </main>
  )
}