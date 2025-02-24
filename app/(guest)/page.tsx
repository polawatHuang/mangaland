import { Suspense } from "react";
import dynamic from "next/dynamic";

import style from "./page.module.css";
import { ScrollUp } from "@/app/components/Footer/Scrollup";
import { fetchProjects } from "@/app/components/FetchProjects/FetchProjects";

const Advertise = dynamic(() => import("@/app/components/Advertise/Advertise"));
const CardSlider = dynamic(() => import("@/app/components/Card/CardSlider"));
const NewManga = dynamic(() => import("@/app/components/Home/NewManga/NewManga"));
const TopManga = dynamic(() => import("@/app/components/Home/TopManga/TopManga"));
const ForYouManga = dynamic(() => import("@/app/components/Home/ForYouManga/ForYouManga"));
const TagManga = dynamic(() => import("@/app/components/Home/TagManga/TagManga"));
const UpManga = dynamic(() => import("@/app/components/Home/UpManga/UpManga"));

interface Manga {
    id: number;
    slug: string;
    backgroundImage: string;
    name: string;
    status: string;
    viewsCount: number;
    createdAt: string;
}

export default async function Home() {
    const mangaList = await fetchProjects();

    return (
        <div>
            <Suspense fallback={<div>Loading advertisement...</div>}>
                <Advertise />
            </Suspense>

            <div className="px-2">
                <h2 className="">🔥ฮิตประจำเดือนนี้</h2>

                <Suspense fallback={<p>Loading manga list...</p>}>
                    <CardSlider mangaList={mangaList} />
                </Suspense>
            </div>

            <div className={`${style.MyGrid} gap-2`}>
                <Suspense fallback={<p>Loading new manga...</p>}>
                    <NewManga />
                    <TagManga />
                    <ForYouManga />
                    <TopManga />
                    <UpManga />
                </Suspense>
            </div>

            <ScrollUp />
        </div>
    );
}