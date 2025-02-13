import { NavbarItem, Setting } from "@/app/models/settings";
import axios from "axios";
import { NextResponse } from "next/server";

const maxCacheTime = 30 * 60000; // 30 * 1 minute
let lastFetchedAt = 0;
let data: NavbarItem[] = []

export async function GET() {
    const now = Date.now();

    if (now - lastFetchedAt < maxCacheTime) {
        console.log("Using cached data");

        return NextResponse.json(data);
    }

    console.log("Fetching new data");

    const res = await axios.get<Setting>(`${process.env.NEXT_PUBLIC_API_URL}/setting/1`)

    data = res.data.result.navbar.items;
    lastFetchedAt = now;

    return NextResponse.json(data);
}