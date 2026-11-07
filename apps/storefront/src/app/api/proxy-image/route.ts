import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    try {
        const safeUrlObj = new URL(targetUrl);
        if (safeUrlObj.hostname === 'localhost') {
            safeUrlObj.hostname = '127.0.0.1';
        }

        // Force Next.js to bypass its internal fetch cache
        const res = await fetch(safeUrlObj.toString(), { cache: 'no-store' });

        if (!res.ok) {
            throw new Error(`Backend returned ${res.status}`);
        }

        const arrayBuffer = await res.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            headers: {
                "Content-Type": res.headers.get("Content-Type") || "image/jpeg",
                "Access-Control-Allow-Origin": "*",
                // Force the browser to never cache this proxy route
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            },
        });
    } catch (error) {
        console.error("PROXY ERROR:", error);
        return new NextResponse("Failed to fetch image", { status: 500 });
    }
}