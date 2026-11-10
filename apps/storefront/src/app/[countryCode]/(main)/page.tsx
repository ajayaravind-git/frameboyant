import { getRegion } from "@lib/data/regions"
import HeroCarousel from "../../../components/HeroCarousel"

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  const countryCode = params.countryCode
  const region = await getRegion(countryCode)

  // Environment Variable Check
  console.log("=== VERCEL ENV CHECK ===");
  console.log("URL:", process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL);
  console.log("KEY:", process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY);
  // ==========================

  let products: any[] = []
  let collections: any[] = []

  try {
    // BYPASS MEDUSA SDK CACHE FOR PRODUCTS
    const productUrl = region
      ? `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?limit=100®ion_id=${region.id}`
      : `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?limit=100`;

    const prodRes = await fetch(productUrl, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string
      },
      cache: 'no-store'
    });

    const prodData = await prodRes.json();
    products = prodData?.products || [];
  } catch (error) {
    console.error(">>> MEDUSA RAW PRODUCT FETCH FAILED:", error)
  }

  try {
    // BYPASS MEDUSA SDK CACHE WITH A DIRECT RAW FETCH
    const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/collections`, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string
      },
      cache: 'no-store'
    });

    const fetchedData = await res.json();
    collections = fetchedData?.collections || [];

    // 3. THE BULLETPROOF FAIL-SAFE (Kept just in case)
    if (!collections || collections.length === 0) {
      console.log(">>> COLLECTION API FAILED/EMPTY. EXTRACTING GENRES FROM PRODUCTS DIRECTLY...")

      const uniqueCollectionsMap = new Map()
      products.forEach((product) => {
        if (product.collection && product.collection.id) {
          uniqueCollectionsMap.set(product.collection.id, product.collection)
        }
      })

      collections = Array.from(uniqueCollectionsMap.values())
    }

  } catch (error) {
    console.error(">>> MEDUSA RAW COLLECTION FETCH FAILED:", error)
  }

  return (
    <main className="min-h-screen bg-[#FDFDFF] relative flex flex-col">

      {/* SECTION 1: 100vh 3D Hero */}
      {products.length > 0 ? (
        <HeroCarousel products={products} />
      ) : (
        <div className="h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-7xl font-black uppercase tracking-tighter text-black">LOUD ART.</h1>
          <p className="text-xl font-bold mt-4 text-[#F42902] bg-[#FDFDFF] px-4 py-1 border-2 border-black">Loading Database...</p>
        </div>
      )}

      {/* SECTION 2: Tightened Marquee Divider */}
      <div className="w-full bg-[#F42902] border-y-[4px] border-black py-2.5 flex overflow-hidden whitespace-nowrap">
        <h2 className="text-lg md:text-xl font-black uppercase tracking-widest text-[#FDFDFF]">
          LOUD ART // PREMIUM FRAMES // LOUD ART // PREMIUM FRAMES // LOUD ART // PREMIUM FRAMES // LOUD ART // PREMIUM FRAMES //
        </h2>
      </div>

      {/* SECTION 3: Pure Typographic Category Grid (Rescaled) */}
      <section className="py-16 md:py-20 px-4 md:px-12 border-b-[4px] border-black">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-8 drop-shadow-sm">
          Browse Genres
        </h2>

        {collections && collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {collections.map((collection: any, index: number) => {
              const hoverColor = index % 2 === 0 ? 'hover:bg-[#83FD80]' : 'hover:bg-[#F42902]'
              const hoverTextColor = index % 2 === 0 ? 'group-hover:text-black' : 'group-hover:text-[#FDFDFF]'

              return (
                <a
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className={`h-32 md:h-48 bg-[#FDFDFF] border-[4px] border-black flex items-center justify-center p-4 ${hoverColor} hover:-translate-y-2 hover:shadow-[8px_8px_0px_#111] transition-all cursor-pointer group`}
                >
                  <span className={`text-3xl md:text-5xl font-black uppercase text-black text-center leading-none tracking-tighter group-hover:scale-110 transition-transform ${hoverTextColor}`}>
                    {collection.title}
                  </span>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="w-full py-12 text-center">
            <p className="text-xl font-bold uppercase tracking-widest bg-black text-[#83FD80] inline-block px-6 py-2 border-2 border-black">
              No Genres Found
            </p>
          </div>
        )}
      </section>

      {/* SECTION 4: Re-balanced Frameboyant Footer */}
      <footer className="bg-black text-[#83FD80] py-16 px-4 md:px-12 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 mix-blend-lighten">
          Frameboyant
        </h1>
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm md:text-base">
          <a href="#" className="font-bold uppercase tracking-widest hover:text-[#F42902] transition-colors">Instagram</a>
          <a href="#" className="font-bold uppercase tracking-widest hover:text-[#F42902] transition-colors">Support</a>
          <a href="#" className="font-bold uppercase tracking-widest hover:text-[#F42902] transition-colors">Terms</a>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">
          © {new Date().getFullYear()} Frameboyant // Operated by LOUD ART.
        </p>
      </footer>

    </main>
  )
}