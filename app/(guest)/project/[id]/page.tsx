import { MagnifyingGlassIcon, ShareIcon } from "@heroicons/react/24/solid";
import AdvertiseComponent from "../../../components/Advertise/Advertise";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import Link from "next/link";
import axios from "axios";
import style from "./chapter.module.css";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
    relativeTime: {
        future: "in %s",
        past: "%s",
        s: "a few seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years",
    },
});

interface Manga {
    id: number;
    slug: string;
    name: string;
    description: string;
    backgroundImage: string;
    episodes: Episode[];
}

interface Episode {
    id: number;
    episodeNumber: number;
    title: string;
    description: string;
    createdAt: string;
}

interface ProjectResponse {
    success: boolean;
    message: string;
    result: {
        id: number;
        title: string;
        description: string;
        coverImage: string;
        episodes: Episode[];
    };
    meta: {
        timestamp: string;
    };
}

async function fetchManga(name: string): Promise<Manga | null> {
    try {
        const response = await axios.get<ProjectResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/project/${name}`
        );

        const project = response.data.result;
        if (!project) {
            return null;
        }

        return {
            id: project.id,
            slug: `/project/${project.id}`,
            name: project.title,
            description: project.description,
            backgroundImage: project.coverImage,
            episodes: project.episodes.map((ep) => ({
                id: ep.id,
                episodeNumber: ep.episodeNumber,
                title: ep.title,
                description: ep.description,
                createdAt: ep.createdAt,
            })),
        };
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
}

export default async function SlugPage({ params }: { params: { id: string } }) {
    if (!params?.id) {
        console.error("Error: ID is missing in params");
        return (
            <p className="text-center text-white">ไม่พบข้อมูลมังงะที่ระบุ</p>
        );
    }

    const manga = await fetchManga(params.id);

    if (!manga) {
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
                    <Link href={`/project/${params.id}`}>{manga.name}</Link>
                </div>
            </section>

            <section className="flex md:flex-row flex-col md:items-start items-center gap-4 mt-4 px-4">
                <img
                    src={manga.backgroundImage}
                    alt={manga.name}
                    className=" h-[350px] object-cover"
                    loading="lazy"
                />
                <div className="mt-4 w-full">
                    <h1 className="text-2xl">ชื่อเรื่อง: {manga.name}</h1>
                    <hr className="my-2" />
                    <p className="text-white">เรื่องย่อ: {manga.description}</p>
                </div>
            </section>

            <section className="px-4">
                <div className="w-full bg-gray-700 py-2">
                    <h2>รายชื่อตอนทั้งหมด</h2>
                    <hr className="my-2" />
                    <div
                        className={`flex flex-col gap-1 h-[300px] ${style.parent}`}
                    >
                        {manga.episodes.length > 0 ? (
                            manga.episodes.map(
                                ({ episodeNumber, title, createdAt }) => (
                                    <Link
                                        key={episodeNumber}
                                        href={`/project/${params.id}/ep${episodeNumber}`}
                                        className={`bg-blue-500 relative min-h-16 hover:bg-blue-600 ${style.child} bg-gray px-4 py-2 flex justify-between`}
                                    >
                                        <span className="text-white text-md font-[600]">
                                            ตอนที่ {episodeNumber} - {title}
                                        </span>
                                        <span className="text-white opacity-50 absolute bottom-1 right-2">
                                            {dayjs(createdAt).fromNow()}
                                        </span>
                                    </Link>
                                )
                            )
                        ) : (
                            <p className="text-gray-500">
                                ขออภัยค่ะ ไม่มีตอนที่ระบุดังกล่าว
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
