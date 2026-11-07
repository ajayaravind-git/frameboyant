"use client"
import { setAddresses } from "@lib/data/cart"
import useToggleState from "@lib/hooks/use-toggle-state"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // BUG PATCH: If there is no shipping address, force the form to stay OPEN.
  // This completely bypasses the infinite <Spinner /> loop.
  const isOpen = searchParams.get("step") === "address" || !cart?.shipping_address

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-[#FDFDFF] w-full">
      <div className="flex flex-row items-center justify-between mb-6 border-b-[4px] border-black pb-4">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black flex items-center gap-4">
          Shipping Address
          {!isOpen && <span className="text-[#83FD80]">✔</span>}
        </h2>

        {!isOpen && cart?.shipping_address && (
          <button
            onClick={handleEdit}
            className="text-sm font-bold uppercase tracking-widest text-[#FDFDFF] bg-black px-4 py-2 hover:bg-[#F42902] transition-colors"
            data-testid="edit-address-button"
          >
            Edit
          </button>
        )}
      </div>

      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div className="mt-8 border-t-[4px] border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">
                  Billing Address
                </h2>
                <BillingAddress cart={cart} />
              </div>
            )}

            {/* Brutalist Submit Button */}
            <button
              type="submit"
              className="mt-8 w-full bg-black text-[#FDFDFF] text-xl font-black uppercase py-4 border-[3px] border-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_#F42902] transition-all"
              data-testid="submit-address-button"
            >
              Continue to Delivery
            </button>

            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div className="text-sm font-bold mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart && cart.shipping_address && (
            <>
              {/* Summary Block 1 */}
              <div className="flex flex-col border-l-[4px] border-black pl-4">
                <span className="uppercase tracking-widest text-black/50 mb-2">Ship To</span>
                <span>{cart.shipping_address.first_name} {cart.shipping_address.last_name}</span>
                <span>{cart.shipping_address.address_1} {cart.shipping_address.address_2}</span>
                <span>{cart.shipping_address.postal_code}, {cart.shipping_address.city}</span>
                <span>{cart.shipping_address.country_code?.toUpperCase()}</span>
              </div>

              {/* Summary Block 2 */}
              <div className="flex flex-col border-l-[4px] border-black pl-4">
                <span className="uppercase tracking-widest text-black/50 mb-2">Contact</span>
                <span>{cart.shipping_address.phone || "No phone provided"}</span>
                <span className="break-all">{cart.email}</span>
              </div>

              {/* Summary Block 3 */}
              <div className="flex flex-col border-l-[4px] border-black pl-4">
                <span className="uppercase tracking-widest text-black/50 mb-2">Bill To</span>
                {sameAsBilling ? (
                  <span>Same as shipping</span>
                ) : (
                  <>
                    <span>{cart.billing_address?.first_name} {cart.billing_address?.last_name}</span>
                    <span>{cart.billing_address?.address_1} {cart.billing_address?.address_2}</span>
                    <span>{cart.billing_address?.postal_code}, {cart.billing_address?.city}</span>
                    <span>{cart.billing_address?.country_code?.toUpperCase()}</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Addresses