"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useParams, useRouter } from "next/navigation";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import style from "./MangaReader.module.css";
import Image from "next/image";

interface EpisodeImage {
    id: number;
    episodeId: number;
    imageNumber: number;
    image: string;
    createdAt: string;
    updatedAt: string;
}

interface MangaReaderProps {
    images: EpisodeImage[];
}

export default function MangaReader({ images }: MangaReaderProps) {
    const [viewMode, setViewMode] = useState<"full" | "single">("full");
    const [showNumpage, setShowNumpage] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { name, episode } = useParams<{ name: string; episode: string }>();
    const router = useRouter();
    const swiperRef = useRef<any>(null);

    const totalPages = images.length;

    // Sort images based on `imageNumber` instead of extracting from filenames
    const sortedImages = [...images].sort(
        (a, b) => a.imageNumber - b.imageNumber
    );

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!swiperRef.current) return;
        const { clientX, target } = e;
        const { left, width } = (
            target as HTMLImageElement
        ).getBoundingClientRect();
        const clickPosition = clientX - left;
        clickPosition < width / 2
            ? swiperRef.current.slidePrev()
            : swiperRef.current.slideNext();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!swiperRef.current) return;
            if (e.key === "ArrowLeft") swiperRef.current.slidePrev();
            if (e.key === "ArrowRight") swiperRef.current.slideNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="w-full md:p-4 bg-black text-white ">
            <div className="flex p-4 justify-between items-center mb-4">
                <Link
                    href={`/project/${name}`}
                    className={`${style.circle} relative p-[2px]`}
                >
                    <ArrowUturnLeftIcon
                        className={`size-8 p-1 bg-black rounded-full z-20 relative`}
                    />
                </Link>

                {/* View Mode Dropdown */}
                <select
                    className="px-3 py-2 bg-pink text-white text-sm hover:bg-[#c03b7b] outline-none rounded-md cursor-pointer"
                    onChange={(e) =>
                        setViewMode(e.target.value as "full" | "single")
                    }
                    value={viewMode}
                >
                    <option value="full">อ่านแบบหน้ายาว</option>
                    <option value="single">อ่านแบบทีละหน้า</option>
                </select>
            </div>

            {viewMode === "full" ? (
                <div className="flex flex-col relative">
                    {sortedImages.map((img, index) => (
                        <div
                            className={`flex flex-col select-none cursor-pointer ${style.card} relative`}
                            key={index}
                            onClick={() => {
                                setShowNumpage((prev) =>
                                    prev === img.imageNumber
                                        ? 0
                                        : img.imageNumber
                                );
                            }}
                        >
                            <Image
                                key={img.id}
                                src={img.image}
                                alt={`Manga Page ${img.imageNumber}`}
                                className="w-full"
                                loading="lazy"
                                width={1000}
                                height={1000}
                            />
                            <p
                                className={` absolute text-white z-[200] bottom-0 text-xl font-bold translate-x-6 transition-all ${
                                    showNumpage == img.imageNumber
                                        ? `opacity-1 translate-y-0`
                                        : `opacity-0 translate-y-10`
                                }`}
                            >
                                หน้าที่: {img.imageNumber}/{totalPages}
                            </p>
                            <div
                                className={`${style.blackBox} h-0 ${
                                    showNumpage == img.imageNumber
                                        ? `h-[10%]`
                                        : `h-0`
                                }`}
                            ></div>
                        </div>
                    ))}
                </div>
            ) : (
                <Swiper
                    modules={[Navigation]}
                    navigation
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper) =>
                        setCurrentPage(swiper.realIndex + 1)
                    }
                    className="w-full relative"
                >
                    {sortedImages.map((img, index) => (
                        <SwiperSlide key={img.id}>
                            <Image
                                src={img.image}
                                alt={`Manga Page ${img.imageNumber}`}
                                className="w-full overflow-hidden cursor-pointer"
                                onClick={handleImageClick}
                                width={1000}
                                height={1000}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
