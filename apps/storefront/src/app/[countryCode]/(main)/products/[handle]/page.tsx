import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import { isVariantInStock } from "@lib/util/inventory"
import {
  buildProductStructuredData,
  getPricedVariants,
  toJsonLd,
} from "@lib/util/product-structured-data"
import { getSiteOrigin, listCountryCodes, STORE_NAME } from "@lib/util/site"

// Import the new Interactive UI
import BrutalistProductUI from "../../../../../components/BrutalistProductUI"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export const dynamic = "force-dynamic"
export const revalidate = 0

// ==========================================
// 1. GENERATE SEO METADATA (Unchanged from your code)
// ==========================================
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const [origin, regions] = await Promise.all([getSiteOrigin(), listRegions()])
  const path = `/products/${product.handle}`
  const productUrl = `${origin}/${params.countryCode}${path}`
  const description = product.description || product.title

  return {
    title: `${product.title} | ${STORE_NAME}`,
    description,
    alternates: {
      canonical: productUrl,
      languages: Object.fromEntries(
        listCountryCodes(regions).map((code) => [
          `en-${code.toUpperCase()}`,
          `${origin}/${code}${path}`,
        ])
      ),
      types: { "text/markdown": `${productUrl}.md` },
    },
    openGraph: {
      title: `${product.title} | ${STORE_NAME}`,
      description,
      url: productUrl,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

// ==========================================
// 2. PRODUCT META TAGS GENERATOR (Unchanged)
// ==========================================
const ProductMetaTags = ({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) => {
  const variants = getPricedVariants(product)
  const cheapest = variants.reduce<HttpTypes.StoreProductVariant | undefined>(
    (min, v) =>
      !min ||
        v.calculated_price!.calculated_amount! <
        min.calculated_price!.calculated_amount!
        ? v
        : min,
    undefined
  )
  const currency = region.currency_code.toUpperCase()
  const amount = cheapest?.calculated_price?.calculated_amount?.toFixed(2)

  return (
    <>
      <meta property="og:type" content="product" />
      {amount && (
        <>
          <meta property="product:price:amount" content={amount} />
          <meta property="product:price:currency" content={currency} />
          <meta property="og:price:amount" content={amount} />
          <meta property="og:price:currency" content={currency} />
        </>
      )}
      <meta
        property="product:availability"
        content={variants.some(isVariantInStock) ? "in stock" : "out of stock"}
      />
    </>
  )
}

// ==========================================
// 3. THE PAGE COMPONENT
// ==========================================
export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  const origin = await getSiteOrigin()
  const structuredData = buildProductStructuredData({
    product: pricedProduct,
    region,
    countryCode: params.countryCode,
    productUrl: `${origin}/${params.countryCode}/products/${pricedProduct.handle}`,
  })

  return (
    <main className="min-h-screen bg-[#FDFDFF] pt-28 md:pt-32 pb-24 px-4 md:px-12">

      <ProductMetaTags product={pricedProduct} region={region} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }}
      />

      {/* Brutalist Breadcrumb */}
      <div className="mb-8 border-b-[4px] border-black pb-4">
        <a href="/" className="font-bold uppercase tracking-widest hover:text-[#F42902] transition-colors">
          HOME
        </a>
        <span className="mx-4 font-black">/</span>
        {pricedProduct.collection && (
          <>
            <a href={`/collections/${pricedProduct.collection.handle}`} className="font-bold uppercase tracking-widest hover:text-[#F42902] transition-colors">
              {pricedProduct.collection.title}
            </a>
            <span className="mx-4 font-black">/</span>
          </>
        )}
        <span className="font-bold uppercase tracking-widest text-[#F42902]">{pricedProduct.title}</span>
      </div>

      {/* Inject the Interactive UI */}
      <BrutalistProductUI product={pricedProduct} region={region} />

    </main>
  )
}