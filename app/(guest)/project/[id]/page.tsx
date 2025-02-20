import { MagnifyingGlassIcon, ShareIcon } from "@heroicons/react/24/solid";
import AdvertiseComponent from "../../../components/Advertise/Advertise";
import dayjs from "dayjs";
import Link from "next/link";
import axios from "axios";

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

async function fetchManga(id: string): Promise<Manga | null> {
    try {
        const response = await axios.get<ProjectResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`
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

            <section className="md:px-[12%]">
                <div className="w-full bg-[#1f2936] px-4 py-2">
                    <Link href="/">Homepage</Link> /{" "}
                    <Link href={`/project/${params.id}`}>{manga.name}</Link>
                </div>
            </section>

            <section className="px-4 md:px-[12%] mt-4 grid grid-cols-1 md:grid-cols-12">
                <img
                    src={manga.backgroundImage}
                    alt={manga.name}
                    className="col-span-12 md:col-span-4 h-[350px] w-auto object-cover"
                    loading="lazy"
                />
                <div className="col-span-12 md:col-span-8 mt-8">
                    <h1 className="text-2xl">ชื่อเรื่อง: {manga.name}</h1>
                    <hr className="my-2" />
                    <p className="text-white">เรื่องย่อ: {manga.description}</p>
                </div>
            </section>

            <section className="md:px-[12%] mt-4">
                <div className="w-full bg-gray-700 px-4 py-2">
                    <h2>รายชื่อตอนทั้งหมด</h2>
                    <hr className="my-2" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                        {manga.episodes.length > 0 ? (
                            manga.episodes.map(
                                ({ episodeNumber, title, createdAt }) => (
                                    <Link
                                        key={episodeNumber}
                                        href={`/project/${params.id}/ep${episodeNumber}`}
                                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 flex justify-between"
                                    >
                                        <span className="text-white font-[600]">
                                            ตอนที่ {episodeNumber} - {title}
                                        </span>
                                        <span className="text-white opacity-50">
                                            {dayjs(createdAt).format(
                                                "DD/MM/YYYY"
                                            )}
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
