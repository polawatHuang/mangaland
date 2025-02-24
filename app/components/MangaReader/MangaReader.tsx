"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useParams } from "next/navigation";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

import style from "./MangaReader.module.css";

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
    const [currentPage, setCurrentPage] = useState(1);
    const { name } = useParams<{ name: string }>();
    const swiperRef = useRef<any>(null);

    const totalPages = images.length;

    const sortedImages = useMemo(
        () => [...images].sort((a, b) => a.imageNumber - b.imageNumber),
        [images]
    );

    const handleImageClick = useCallback(
        (e: React.MouseEvent<HTMLImageElement>) => {
            if (!swiperRef.current) return;
            const { clientX, target } = e;
            const { left, width } = (
                target as HTMLImageElement
            ).getBoundingClientRect();
            const clickPosition = clientX - left;
            clickPosition < width / 2
                ? swiperRef.current.slidePrev()
                : swiperRef.current.slideNext();
        },
        []
    );

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
        <div className="w-full md:p-4 bg-black text-white min-h-screen">
            <div className="flex p-4 justify-between items-center mb-4">
                <Link
                    href={`/project/${name}`}
                    className={`${style.circle} relative p-[2px]`}
                >
                    <ArrowUturnLeftIcon className="size-8 p-1 bg-black rounded-full z-20 relative" />
                </Link>

                <select
                    className="px-3 py-2 bg-pink text-white text-sm hover:bg-[#c03b7b] outline-none rounded-md cursor-pointer"
                    onChange={(e) => setViewMode(e.target.value as "full" | "single")}
                    value={viewMode}
                >
                    <option value="full">📜 อ่านแบบหน้ายาว</option>
                    <option value="single">📖 อ่านแบบทีละหน้า</option>
                </select>
            </div>

            {viewMode === "full" ? (
                <div className="flex flex-col relative">
                    {sortedImages.map((img, index) => (
                        <div key={index} className={`relative ${style.card}`}>
                            <Image
                                src={img.image}
                                alt={`${img.imageNumber}`}
                                className="w-full"
                                loading="lazy"
                                width={250}
                                height={350}
                                unoptimized={true}
                            />
                            <p className={`absolute text-white z-[200] bottom-0 md:bottom-1 text-xs md:text-lg font-bold transition-all px-4 py-1 ml-2 md:ml-3 bg-black bg-opacity-50 rounded-lg opacity-50`}>
                                หน้า {img.imageNumber} / {totalPages}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <Swiper
                    modules={[Navigation]}
                    navigation
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper) => setCurrentPage(swiper.realIndex + 1)}
                    className="w-full relative"
                >
                    {sortedImages.map((img, index) => (
                        <SwiperSlide key={index}>
                            <Image
                                src={img.image}
                                alt={`Manga Page ${img.imageNumber}`}
                                className="w-full cursor-pointer"
                                onClick={handleImageClick}
                                width={250}
                                height={350}
                                unoptimized={true}
                            />
                        </SwiperSlide>
                    ))}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-lg z-20">
                        หน้า {currentPage} / {totalPages}
                    </div>
                </Swiper>
            )}
        </div>
    );
}