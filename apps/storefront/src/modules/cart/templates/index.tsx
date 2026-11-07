import ItemsTemplate from "./items"
import Summary from "./summary"
import SignInPrompt from "../components/sign-in-prompt"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <main className="min-h-screen bg-[#FDFDFF] pt-24 md:pt-28 pb-24 px-4 md:px-12">

      {/* SCALED DOWN: Header text size and border thickness reduced */}
      <div className="mb-8 md:mb-10 border-b-[2px] border-black pb-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-none">
          Your Cart
        </h1>
        <p className="mt-2 text-base md:text-lg font-bold uppercase tracking-widest text-[#F42902] border-l-[3px] border-[#F42902] pl-3">
          Review Your Selections
        </p>
      </div>

      <div data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 md:gap-10 relative">

            <div className="flex flex-col gap-y-6">
              {!customer && (
                // SCALED DOWN: 2px borders, 4px shadows instead of 8px
                <div className="border-[2px] border-black p-5 bg-[#83FD80] shadow-[4px_4px_0px_#111]">
                  <SignInPrompt />
                </div>
              )}

              {/* SCALED DOWN: Main items container */}
              <div className="border-[2px] border-black bg-[#FDFDFF] shadow-[4px_4px_0px_#111] p-4 md:p-6">
                <ItemsTemplate cart={cart} />
              </div>
            </div>

            <div className="w-full relative">
              {/* SCALED DOWN: Sticky summary box */}
              <div className="lg:sticky lg:top-32 border-[2px] border-black bg-[#FDFDFF] p-6 shadow-[4px_4px_0px_#111]">
                {cart && cart.region && (
                  <Summary cart={cart} />
                )}
              </div>
            </div>

          </div>
        ) : (
          /* SCALED DOWN: Empty cart state */
          <div className="w-full py-20 flex flex-col items-center justify-center text-center border-[2px] border-black border-dashed bg-black/5">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black mb-3">
              Cart is Empty
            </h2>
            <p className="text-lg font-bold uppercase tracking-widest text-[#F42902] mb-6">
              Grab some loud art.
            </p>
            <a
              href="/"
              className="bg-black text-[#83FD80] text-lg font-bold uppercase tracking-widest py-3 px-6 border-[2px] border-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111] transition-all"
            >
              Back to Store
            </a>
          </div>
        )}
      </div>
    </main>
  )
}

export default CartTemplate