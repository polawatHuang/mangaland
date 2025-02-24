"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdvertiseComponent from "../../../../components/Advertise/Advertise";
import MangaReader from "../../../../components/MangaReader/MangaReader";
import Link from "next/link";
import { ScrollUp } from "@/app/components/Footer/Scrollup";
import { NextEp } from "@/app/components/Footer/NextEp";

interface EpisodeImage {
    id: number;
    episodeId: number;
    imageNumber: number;
    image: string;
    createdAt: string;
    updatedAt: string;
}

interface EpisodeData {
    id: number;
    projectId: number;
    episodeNumber: number;
    description: string;
    viewsCount: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    images: EpisodeImage[];
    project: ProjectProps;
}
interface ProjectProps {
    title: string | null;
    slug: string;
}
interface EpisodePageProps {
    name: string;
    episode: string;
}

export default function EpisodePage() {
    const params = useParams();
    const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
    const [mangaImages, setMangaImages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    async function fetchEpisodeData(episode: string): Promise<string[] | null> {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/episode/${params.name}/${episode}`
            );
            if (!response.ok) throw new Error("Failed to fetch episode data");

            const data = await response.json();
            setEpisodeData(data.data);
            return data.data.images;
        } catch (error) {
            console.error("Error fetching episode data for", episode, error);
            return null;
        }
    }

    useEffect(() => {
        async function loadEpisode() {
            if (!params.episode) return;

            const episodeToLoad = Array.isArray(params.episode)
                ? params.episode[0]
                : params.episode;

            const data = await fetchEpisodeData(episodeToLoad);
            if (data) {
                setMangaImages(data);
            } else {
                setMangaImages([]);
            }

            setLoading(false);
        }
        loadEpisode();
    }, [params.episode]);
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>กำลังโหลดข้อมูล...</span>
            </div>
        );
    }

    if (mangaImages.length === 0) {
        return (
            <p className="text-center text-white">ไม่พบข้อมูลมังงะที่ระบุ</p>
        );
    }

    return (
        <div className="relative w-full min-h-screen max-w-6xl mx-auto md:p-8 pb-20 gap-16 sm:p-2">
            <section>
                <AdvertiseComponent />
            </section>

            <section className="">
                <div className="w-full bg-[#1f2936] px-4 py-2">
                    <Link href="/">Homepage</Link> /{" "}
                    <Link href={`/project/${params.name}`}>
                        {episodeData?.project?.title}
                    </Link>{" "}
                    /{" "}
                    <Link href={`/project/${params.name}/${params.episode}`}>
                        ตอนที่ {episodeData?.episodeNumber}
                    </Link>{" "}
                    -{" "}
                    <Link href={`/project/${params.name}`}>
                        {episodeData?.title ?? params.episode}
                    </Link>{" "}
                </div>
            </section>
            <div id="long-content">
                <MangaReader images={mangaImages} />
            </div>
            <ScrollUp />
            <NextEp
                params={{
                    episodeNumber: Array.isArray(params.episode)
                        ? params.episode[0]
                        : params.episode ?? "",
                    mangaName: Array.isArray(params.name)
                        ? params.name[0]
                        : params.name ?? "",
                }}
            />
        </div>
    );
}
