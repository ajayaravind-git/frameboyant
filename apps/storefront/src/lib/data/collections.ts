"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const retrieveCollection = async (id: string) => {
  return await sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        method: "GET",
        cache: "no-store", // Bypass Vercel CDN Cache
      }
    )
    .then(({ collection }) => collection)
    .catch((error) => {
      console.error(`>>> RETRIEVE COLLECTION FAILED for id ${id}:`, error);
      return null;
    });
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  return await sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
      "/store/collections",
      {
        method: "GET",
        query: queryParams,
        cache: "no-store", // Bypass Vercel CDN Cache
      }
    )
    .then(({ collections }) => ({ collections, count: collections.length }))
    .catch((error) => {
      console.error(">>> LIST COLLECTIONS FAILED:", error);
      return { collections: [], count: 0 };
    });
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  return await sdk.client
    .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
      method: "GET",
      query: { handle, fields: "*products" },
      cache: "no-store", // Bypass Vercel CDN Cache
    })
    .then(({ collections }) => collections[0] || null)
    .catch((error) => {
      console.error(`>>> GET COLLECTION BY HANDLE FAILED for ${handle}:`, error);
      return null;
    });
}