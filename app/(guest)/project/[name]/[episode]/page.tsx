import { notFound } from "next/navigation";
import Link from "next/link";
import AdvertiseComponent from "@/app/components/Advertise/Advertise";
import MangaReader from "@/app/components/MangaReader/MangaReader";
import { ScrollUp } from "@/app/components/Footer/Scrollup";
import { NextEp } from "@/app/components/Footer/NextEp";
import Loading from "@/app/components/Loading/Loading";
import { Suspense } from "react";

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
    params: { name: string; episode: string };
}

async function getEpisodeData(
    name: string,
    episode: string
): Promise<EpisodeData | null> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/episode/${name}/${episode}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) return null;

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching episode data:", error);
        return null;
    }
}

export default function EpisodePage({ params }: EpisodePageProps) {
    return (
        <Suspense fallback={<Loading />}>
            <EpisodeContent params={params} />
        </Suspense>
    );
}

async function EpisodeContent({ params }: EpisodePageProps) {
    const { name, episode } = params;
    const episodeData = await getEpisodeData(name, episode);

    if (!episodeData) return notFound();

    return (
        <div className="relative w-full min-h-screen max-w-6xl mx-auto md:p-8 pb-20 gap-16 sm:p-2">
            <section>
                <AdvertiseComponent />
            </section>

            <section>
                <div className="w-full bg-[#1f2936] px-4 py-2">
                    <Link href="/">Homepage</Link> /{" "}
                    <Link href={`/manga/${name}`}>
                        {episodeData?.title ?? episode}
                    </Link>{" "}
                    /{" "}
                    <Link href={`/manga/${name}/${episode}`}>
                        ตอนที่ {episodeData?.episodeNumber}
                    </Link>
                </div>
            </section>

            <div id="long-content">
                <MangaReader images={episodeData.images} />
            </div>
            <ScrollUp />
            <NextEp
                params={{
                    episodeNumber: episode,
                    mangaName: name,
                }}
            />

            <ScrollUp />
        </div>
    );
}

export async function generateStaticParams() {
    return [];
}
