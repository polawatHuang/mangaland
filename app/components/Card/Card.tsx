"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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

  // Load favorite mangas from localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteMangas") || "[]") as Manga[];
    setFavorites(storedFavorites);
  }, []);

  // Toggle favorite manga
  const toggleFavorite = () => {
    let updatedFavorites: Manga[];
    if (favorites.some((fav) => fav.id === manga.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== manga.id); // Remove favorite
    } else {
      updatedFavorites = [...favorites, manga]; // Add favorite
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteMangas", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="relative w-full h-auto overflow-hidden">
      {/* Favorite Button */}
      {hasFevFunction && (
        <button
          onClick={toggleFavorite}
          className="absolute top-1 right-1 p-2 h-9 bg-black bg-opacity-50 rounded-full flex items-center"
        >
          {favorites.some((fav) => fav.id === manga.id) ? (
            <span className="text-red-500 text-xl">❤️</span>
          ) : (
            <span className="text-white text-xl mt-[2px]">🤍</span>
          )}
        </button>
      )}

      {/* Manga Card */}
      <Link href={manga.slug}>
        <Image
          width={187}
          height={268}
          src={manga.backgroundImage}
          alt={manga.name}
          className="h-[220px] w-full object-cover"
          loading="lazy"
        />
        <div className="py-4">
          <h2 className="text-lg font-semibold text-white text-ellipsis line-clamp-3">
            {manga.name}
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default Card;