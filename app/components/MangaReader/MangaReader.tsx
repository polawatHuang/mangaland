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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const params = useParams<{ slug: string; ep: string }>();
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
        <div className="w-full md:p-4 bg-black text-white min-h-screen">
            <div className="flex p-4 justify-between items-center mb-4">
                <Link
                    href={`/${params.slug}`}
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
                <div className="flex flex-col">
                    {sortedImages.map((img) => (
                        <img
                            key={img.id}
                            src={img.image}
                            alt={`Manga Page ${img.imageNumber}`}
                            className="w-full"
                            loading="lazy"
                        />
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
                    {sortedImages.map((img) => (
                        <SwiperSlide key={img.id}>
                            <img
                                src={img.image}
                                alt={`Manga Page ${img.imageNumber}`}
                                className="w-full cursor-pointer"
                                onClick={handleImageClick}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
