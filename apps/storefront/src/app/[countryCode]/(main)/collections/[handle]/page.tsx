import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function CollectionPage(props: { params: Promise<{ handle: string, countryCode: string }> }) {
  const params = await props.params
  const { handle, countryCode } = params
  const region = await getRegion(countryCode)

  let targetCollection = null
  try {
    const fetchedData = await listCollections()
    const collections = fetchedData?.collections || []
    targetCollection = collections.find((c: any) => c.handle === handle)
  } catch (error) {
    console.error(">>> COLLECTION FETCH FAILED", error)
  }

  if (!targetCollection) {
    notFound()
  }

  let products: any[] = []
  try {
    const { response } = await listProducts({
      pageParam: 0,
      queryParams: { collection_id: [targetCollection.id], limit: 100 },
      countryCode: countryCode,
    })
    products = response.products || []
  } catch (error) {
    console.error(">>> PRODUCT FETCH FAILED", error)
  }

  return (
    // Reduced top padding slightly to pull everything up
    <main className="min-h-screen bg-[#FDFDFF] flex flex-col pt-24 md:pt-28 pb-24">

      {/* SECTION 1: Massive Collection Header (SCALED DOWN) */}
      {/* Reduced bottom padding and border thickness */}
      <div className="w-full px-4 md:px-12 pb-6 md:pb-8 border-b-[4px] border-black">
        {/* Shrunk text from text-[9rem] to text-7xl/8xl so it doesn't hog the screen */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-black leading-[0.85] drop-shadow-sm break-words">
          {targetCollection.title}
        </h1>
        {/* Reduced top margin for the badges */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#FDFDFF] bg-[#F42902] px-4 py-2 border-[2px] border-black shadow-[3px_3px_0px_#111]">
            {products.length} {products.length === 1 ? 'Artwork' : 'Artworks'}
          </span>
          <a href="/" className="text-xs md:text-sm font-bold uppercase tracking-widest text-black bg-[#83FD80] px-4 py-2 border-[2px] border-black shadow-[3px_3px_0px_#111] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111] transition-all">
            ← Back to Genres
          </a>
        </div>
      </div>

      {/* SECTION 2: Brutalist Product Grid */}
      {/* Drastically reduced this top padding (was pt-16, now pt-8) to pull the grid up */}
      <div className="px-4 md:px-12 pt-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <a
                key={product.id}
                href={`/products/${product.handle}`}
                // Reduced border thickness and hover shadow spread
                className="group flex flex-col bg-[#FDFDFF] border-[3px] border-black hover:-translate-y-1.5 hover:shadow-[8px_8px_0px_#111] transition-all cursor-pointer"
              >
                {/* Image Box */}
                <div className="aspect-[4/5] w-full border-b-[3px] border-black bg-black/5 overflow-hidden relative">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-xl uppercase opacity-20">
                      No Image
                    </div>
                  )}

                  {/* Hover Badge (Scaled down) */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <span className="bg-[#83FD80] text-black text-xs font-black uppercase tracking-widest px-3 py-1 border-[2px] border-black shadow-[2px_2px_0px_#111]">
                      View Frame
                    </span>
                  </div>
                </div>

                {/* Product Info Block (Scaled down padding) */}
                <div className="p-4 flex flex-col flex-grow justify-between bg-[#FDFDFF] transition-colors">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black leading-none mb-4">
                    {product.title}
                  </h3>
                  <div className="mt-auto">
                    <span className="text-[10px] md:text-xs font-bold bg-black text-[#FDFDFF] px-3 py-1.5 uppercase tracking-widest inline-block group-hover:bg-[#F42902] transition-colors">
                      View Details →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center border-[3px] border-black border-dashed bg-black/5">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-black mb-3">No Artworks Yet</h2>
            <p className="text-lg font-bold uppercase text-[#F42902]">This collection is currently empty.</p>
          </div>
        )}
      </div>
    </main>
  )
}