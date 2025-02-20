import { Suspense } from "react";
import dynamic from "next/dynamic";
import { ScrollUp } from "../components/Footer/Scrollup";
import axios from "axios";
import dayjs from "dayjs";
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
    { ssr: true }
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

async function fetchProjects(): Promise<Manga[]> {
    try {
        const response = await axios.get<MultiProjectResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/project`
        );

        const currentMonth = dayjs().month();
        const currentYear = dayjs().year();

        const filteredProjects = response.data.result.projects
            .filter((project: Project) => {
                const projectDate = dayjs(project.createdAt);
                return (
                    projectDate.month() === currentMonth &&
                    projectDate.year() === currentYear
                );
            })
            .sort((a, b) => b.viewsCount - a.viewsCount)
            .slice(0, 5); // Take top 5

        return filteredProjects.map((project: Project) => ({
            id: project.id,
            slug: `/project/${project.title
                .replace(/\s+/g, "-")
                .toLowerCase()}`,
            backgroundImage: project.coverImage,
            name: project.title,
            viewsCount: project.viewsCount,
            createdAt: project.createdAt,
        }));
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
}

export const revalidate = 3600;
