import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";

import style from "./chapter.module.css";
import Loading from "@/app/components/Loading/Loading";
import AdvertiseComponent from "@/app/components/Advertise/Advertise";
import { fetchManga } from "@/app/components/FetchManga/FetchManga";

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

export default async function SlugPage({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    return (
        <Suspense fallback={<Loading />}>
            <MangaContent params={await params} />
        </Suspense>
    );
}

async function MangaContent({ params }: { params: { name: string } }) {
    const manga = await fetchManga(params.name);

    if (!manga) return notFound();
    return (
        <div className="relative w-full min-h-screen max-w-6xl mx-auto md:p-8 pb-20 gap-16 sm:p-2">
            <section>
                <AdvertiseComponent />
            </section>

            <section>
                <div className="w-full bg-[#1f2936] px-4 py-2 text-white">
                    <Link href="/">Homepage</Link> /{" "}
                    <Link href={`/project/${params.name}`}>{manga.name}</Link>
                </div>
            </section>

            <section className="flex md:flex-row flex-col md:items-start items-center gap-4 mt-4 px-4">
                <Image
                    src={manga.backgroundImage}
                    alt={`${manga.name}`}
                    className="h-[350px] object-cover rounded-lg shadow-md"
                    loading="lazy"
                    width={250}
                    height={350}
                />
                <div className="mt-4 w-full">
                    <h1 className="text-2xl font-bold text-white">
                        📖 {manga.name}
                    </h1>
                    <hr className="my-2 border-gray-600" />
                    <p className="text-white text-sm leading-relaxed">
                        {manga.description || "ไม่มีข้อมูลเรื่องย่อ"}
                    </p>
                </div>
            </section>

            <section className="px-4 mt-6">
                <div className="w-full bg-gray py-2 px-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-white">
                        📚 รายชื่อตอนทั้งหมด
                    </h2>
                    <hr className="my-2 border-white" />
                    <div
                        className={`flex flex-col gap-1 overflow-auto max-h-[500px]`}
                    >
                        {manga.episodes.length > 0 ? (
                            manga.episodes.map(
                                ({ episodeNumber, title, createdAt }) => (
                                    <Link
                                        key={episodeNumber}
                                        href={`/project/${params.name}/${episodeNumber}`}
                                        className={` relative min-h-16 ${style.child} px-4 py-2 flex justify-between items-center rounded-md shadow-md`}
                                    >
                                        <span className="text-white text-md font-semibold">
                                            ตอนที่ {episodeNumber} -{" "}
                                            {title || "ไม่มีชื่อ"}
                                        </span>
                                        <span className="text-white opacity-50 text-sm">
                                            ⏳ {dayjs(createdAt).fromNow()}
                                        </span>
                                    </Link>
                                )
                            )
                        ) : (
                            <p className="text-gray-400 text-sm text-center py-4">
                                ❌ ไม่มีตอนที่ระบุ
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export async function generateStaticParams() {
    return [];
}
