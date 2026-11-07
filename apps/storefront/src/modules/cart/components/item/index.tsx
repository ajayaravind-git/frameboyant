"use client"

import { Table, clx } from "@modules/common/components/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    // Softened the row divider line
    <Table.Row className="w-full border-b-[2px] border-black/10" data-testid="product-row">
      <Table.Cell className="!pl-0 py-4 w-24 md:w-28">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          // Reduced thumbnail border to 2px
          className={clx("flex border-[2px] border-black", {
            "w-16": type === "preview",
            "w-full": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left py-4 pl-4 md:pl-6">
        {/* Shrunk title from text-2xl font-black to text-lg font-bold */}
        <span
          className="block text-base md:text-lg font-bold uppercase tracking-tight text-black mb-1"
          data-testid="product-title"
        >
          {item.product_title}
        </span>
        {/* Changed from red text to a subtle faded black */}
        <div className="font-semibold text-xs uppercase tracking-widest text-black/50">
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </div>
      </Table.Cell>

      {type === "full" && (
        <Table.Cell className="py-4">
          <div className="flex gap-4 items-center">
            {/* Shrunk the dropdown height and width */}
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="w-14 h-10"
              data-testid="product-select-button"
            >
              {Array.from(
                {
                  length: Math.min(maxQuantity, 10),
                },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                )
              )}
              <option value={1} key={1}>
                1
              </option>
            </CartItemSelect>
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell py-4">
          <div className="font-bold text-base text-black/60">
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0 py-4">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-2 font-bold uppercase mb-1 text-sm">
              <span className="text-black/50">{item.quantity}x </span>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          {/* Scaled down the total price size */}
          <div className="font-bold text-lg md:text-xl text-black">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item