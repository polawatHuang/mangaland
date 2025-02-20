"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/solid";

interface Manga {
    id: number;
    slug: string;
    backgroundImage: string;
    name: string;
}

interface CardProps {
    manga: Manga;
    hasFevFunction?: boolean;
}

const Card: React.FC<CardProps> = ({ manga, hasFevFunction = true }) => {
    const [favorites, setFavorites] = useState<Manga[]>([]);
    useEffect(() => {
        const storedFavorites = JSON.parse(
            localStorage.getItem("favoriteMangas") || "[]"
        ) as Manga[];
        setFavorites(storedFavorites);
    }, []);
    const toggleFavorite = () => {
        let updatedFavorites: Manga[];
        if (favorites.some((fav) => fav.id === manga.id)) {
            updatedFavorites = favorites.filter((fav) => fav.id !== manga.id); // Remove favorite
        } else {
            updatedFavorites = [...favorites, manga]; // Add favorite
        }

        setFavorites(updatedFavorites);
        localStorage.setItem(
            "favoriteMangas",
            JSON.stringify(updatedFavorites)
        );
    };

    return (
        <div className="relative w-full h-auto overflow-hidden">
            {hasFevFunction && (
                <button
                    onClick={toggleFavorite}
                    className="absolute top-1 right-1 p-2 h-9 bg-black z-40 bg-opacity-50 rounded-full flex items-center"
                >
                    {favorites.some((fav) => fav.id === manga.id) ? (
                        <span className="text-red-500 text-xl">
                            <HeartIcon className="size-6 text-[#f60002]" />
                        </span>
                    ) : (
                        <span className="text-red-500 text-xl">
                            <HeartIcon className="size-6" />
                        </span>
                    )}
                </button>
            )}
            <Link href={manga.slug} className="relative card">
                <Image
                    width={187}
                    height={268}
                    src={manga.backgroundImage}
                    alt={manga.name}
                    className="h-[220px] w-full object-cover"
                />
                <div className="py-4 absolute bottom-0 left-[50%] translate-x-[-50%] z-10">
                    <h2 className="text-lg font-semibold text-white leading-5 text-ellipsis text-center line-clamp-3">
                        {manga.name}
                    </h2>
                </div>
            </Link>
        </div>
    );
};

export default Card;
