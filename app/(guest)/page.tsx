import { Suspense } from "react";
import dynamic from "next/dynamic";
import { ScrollUp } from "../components/Footer/Scrollup";
import axios from "axios";
import { Project, MultiProjectResponse } from "../models/project";
import style from "./page.module.css";

const Advertise = dynamic(() => import("../components/Advertise/Advertise"));

const CardSlider = dynamic(() => import("../components/Card/CardSlider"), {
    ssr: true,
});
const NewManga = dynamic(() => import("../components/Home/NewManga/NewManga"), {
    ssr: true,
});
const TopManga = dynamic(() => import("../components/Home/TopManga/TopManga"), {
    ssr: true,
});
const ForYouManga = dynamic(
    () => import("../components/Home/ForYouManga/ForYouManga"),
    {
        ssr: true,
    }
);
const TagManga = dynamic(() => import("../components/Home/TagManga/TagManga"), {
    ssr: true,
});
const UpManga = dynamic(() => import("../components/Home/UpManga/UpManga"), {
    ssr: true,
});

interface Manga {
    id: number;
    slug: string;
    backgroundImage: string;
    name: string;
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
                    <CardSlider mangaList={mangaList.slice(0, 5)} />
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

async function fetchProjects(): Promise<Manga[]> {
    try {
        const response = await axios.get<MultiProjectResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/project`
        );

        return response.data.result.projects.map((project: Project) => ({
            id: project.id,
            slug: `/project/${project.id}`,
            backgroundImage: project.coverImage,
            name: project.title,
        }));
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
}

export const revalidate = 3600;
