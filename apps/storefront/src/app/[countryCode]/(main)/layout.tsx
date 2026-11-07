import { retrieveCart } from "@lib/data/cart"
import FloatingNav from "../../../components/FloatingNav"
import CartDrawer from "../../../components/CartDrawer"

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch the cart globally so the Nav and Drawer work on every page
  const cart = await retrieveCart()

  return (
    <>
      <FloatingNav cart={cart} />

      {/* This renders page.tsx, checkout, or any other route */}
      {children}

      <CartDrawer cart={cart} />
    </>
  )
}