import { LayoutReturnResponse } from "@/app/models/server";
import { SettingResponse } from "@/app/models/settings";
import axios from "axios";
import { NextResponse } from "next/server";

const maxCacheTime = 30 * 60000; // 30 * 1 minute
let lastFetchedAt = 0;

let responseCache: LayoutReturnResponse | undefined

export async function GET() {
    const now = Date.now();

    if (now - lastFetchedAt < maxCacheTime) {
        console.log("Using cached data");

        return NextResponse.json(responseCache);
    }

    console.log("Fetching new data");

    const { data } = await axios.get<SettingResponse>(`${process.env.NEXT_PUBLIC_API_URL}/setting/1`)

    responseCache = {
        footer: data.result.footer,
        navbar: data.result.navbar.items
    };
    lastFetchedAt = now;

    return NextResponse.json(data);
}