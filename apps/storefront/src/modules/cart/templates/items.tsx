import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table } from "@modules/common/components/ui"
import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items

  return (
    <div>
      <div className="pb-6 mb-6 border-b-[4px] border-black flex items-center">
        <h2 className="text-xl md:text-2xl font-medium uppercase tracking-normal text-black">
          Cart Items
        </h2>
      </div>

      <Table className="w-full">
        {/* Forcing heavy borders and black text onto the Medusa Table Header */}
        <Table.Header className="border-t-0 border-b-[4px] border-black">
          <Table.Row className="text-black font-black uppercase tracking-widest text-sm md:text-base">
            <Table.HeaderCell className="!pl-0 pb-4">Item</Table.HeaderCell>
            <Table.HeaderCell className="pb-4"></Table.HeaderCell>
            <Table.HeaderCell className="pb-4">Quantity</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell pb-4">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right pb-4">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {items
            ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={cart?.currency_code}
                  />
                )
              })
            : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate