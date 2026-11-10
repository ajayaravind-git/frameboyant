"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const listRegions = async () => {
  return await sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      // Revalidates in the background every 5 minutes to prevent middleware timeouts
      next: { revalidate: 300 },
    })
    .then(({ regions }) => regions)
    .catch((error) => {
      console.error(">>> LIST REGIONS FAILED:", error);
      return [];
    });
}

export const retrieveRegion = async (id: string) => {
  return await sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next: { revalidate: 300 },
    })
    .then(({ region }) => region)
    .catch((error) => {
      console.error(">>> RETRIEVE REGION FAILED:", error);
      return null;
    });
}

export const getRegion = async (countryCode: string) => {
  const regions = await listRegions()

  if (!regions || regions.length === 0) {
    console.error(">>> NO REGIONS RETURNED FROM DATABASE");
    return null
  }

  // MOVED INSIDE THE FUNCTION: Bypasses Vercel serverless container memory cache
  const regionMap = new Map<string, HttpTypes.StoreRegion>()

  regions.forEach((region) => {
    region.countries?.forEach((c) => {
      regionMap.set(c?.iso_2 ?? "", region)
    })
  })

  // Changed default fallback to "in" (India) instead of "us"
  const region = countryCode
    ? regionMap.get(countryCode)
    : regionMap.get("in")

  if (!region) {
    console.error(`>>> Region mapping failed for country code: ${countryCode}`);
  }

  return region
}