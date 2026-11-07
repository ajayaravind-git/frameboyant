import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { HttpTypes } from "@medusajs/types"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="w-full flex flex-col">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-black">
          In Your Cart
        </h2>

        {/* Heavy Divider */}
        <div className="border-t-[4px] border-black pt-6 mb-6">
          <CartTotals totals={cart} />
        </div>

        <div className="border-t-[4px] border-black pt-6 mb-6">
          <ItemsPreviewTemplate cart={cart} />
        </div>

        <div className="border-t-[4px] border-black pt-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary