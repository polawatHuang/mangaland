"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdvertiseComponent from "../../../../components/Advertise/Advertise";
import MangaReader from "../../../../components/MangaReader/MangaReader";
import Link from "next/link";
import { ShareIcon } from "@heroicons/react/24/solid";
import Card from "../../../../components/Card/Card";
import { ScrollUp } from "@/app/components/Footer/Scrollup";

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
    title: string;
    description: string;
    viewsCount: number;
    createdAt: string;
    updatedAt: string;
    images: EpisodeImage[];
}

export default function EpisodePage() {
    const { slug, ep } = useParams<{ slug: string; ep: string }>();
    const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
    const [mangaImages, setMangaImages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showScroll, setShowScroll] = useState<boolean>(false);
    const [currentEpisode, setCurrentEpisode] = useState<string>(ep);

    const getEpisodeNumber = (episodeStr: string): number => {
        const num = parseInt(episodeStr.replace("ep", ""), 10);
        return isNaN(num) ? 1 : num;
    };

    async function fetchEpisodeData(episode: string): Promise<string[] | null> {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/episode/1`
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
            let data = await fetchEpisodeData(ep);
            let episodeToLoad = ep;

            if (!data) {
                const currentEpNumber = getEpisodeNumber(ep);
                if (currentEpNumber > 1) {
                    episodeToLoad = `ep${currentEpNumber - 1}`;
                    data = await fetchEpisodeData(episodeToLoad);
                }
            }

            if (data) {
                setMangaImages(data);
                setCurrentEpisode(episodeToLoad);
            } else {
                setMangaImages([]);
            }

            setLoading(false);
        }
        loadEpisode();
    }, [slug, ep]);

    useEffect(() => {
        const handleScroll = () => setShowScroll(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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
                    <Link href="/">Homepage</Link> /
                    <Link href={`/manga/${slug}`}>
                        {episodeData?.title ?? slug}
                    </Link>{" "}
                    /
                    <Link href={`/manga/${slug}/${currentEpisode}`}>
                        ตอนที่ {episodeData?.episodeNumber}
                    </Link>
                </div>
            </section>
            <div id="long-content">
                <MangaReader images={mangaImages} />
            </div>
            {showScroll && <ScrollUp />}
        </div>
    );
}
