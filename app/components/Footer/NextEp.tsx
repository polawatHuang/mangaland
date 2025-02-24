"use client";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export const NextEp = ({
    params,
}: {
    params: { episodeNumber: string; mangaName: string };
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [mangaLenth, setMangaLength] = useState(0);
    const EpNumber = parseInt(params.episodeNumber);
    const MangaName = params.mangaName;
    const router = useRouter();

    useEffect(() => {
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_URL}/episode/project/${MangaName}`
            )
            .then((res) => {
                setMangaLength(res.data.result.length);
            });
    }, []);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
    const handlePreviousEpisode = () => {
        if (EpNumber > 1) {
            router.push(`/project/${MangaName}/${EpNumber - 1}`);
        }
    };
    const handleNextEpisode = () => {
        if (EpNumber < mangaLenth) {
            router.push(`/project/${MangaName}/${EpNumber + 1}`);
        }
    };
    return (
        <div className="fixed left-10 z-50 bottom-10 md:left-20 md:bottom-20 flex items-center gap-1">
            <button
                className={`${
                    isVisible ? `visible` : `invisible`
                } bg-gray w-12 h-10 flex justify-center items-center rounded-l-xl transition-all hover:bg-pink hover:w-16 disabled:opacity-50 disabled:hover:w-12 disabled:hover:bg-gray disabled:cursor-not-allowed `}
                disabled={EpNumber <= 1}
                onClick={handlePreviousEpisode}
            >
                <ChevronLeftIcon className="size-8" />
            </button>
            <button
                className={`${
                    isVisible ? `visible` : `invisible`
                } bg-gray w-12 h-10 flex justify-center items-center rounded-r-xl transition-all hover:bg-pink hover:w-16 disabled:opacity-50 disabled:hover:w-12 disabled:hover:bg-gray disabled:cursor-not-allowed `}
                disabled={EpNumber >= mangaLenth}
                onClick={handleNextEpisode}
            >
                <ChevronRightIcon className="size-8" />
            </button>
        </div>
    );
};
