"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useRef, useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";

interface Manga {
  id: number;
  slug: string;
  backgroundImage: string;
  name: string;
}

interface CardSliderComponentProps {
  mangaList: Manga[];
  hasFevFunction?: boolean;
}

const ChevronLeftIcon = () => (
  <svg
    className="w-10 h-10 text-gray-700 hover:text-gray-900"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    className="w-10 h-10 text-gray-700 hover:text-gray-900"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const CardSliderComponent: React.FC<CardSliderComponentProps> = ({ mangaList, hasFevFunction = false }) => {
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState<boolean>(true);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Manga[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteMangas") || "[]") as Manga[];
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (manga: Manga) => {
    let updatedFavorites: Manga[];
    if (favorites.some((fav) => fav.id === manga.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== manga.id);
    } else {
      updatedFavorites = [...favorites, manga];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteMangas", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="relative w-full px-4 py-6">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        className="w-full"
      >
        {mangaList.map((manga) => (
          <SwiperSlide key={manga.id} className="relative">
            {hasFevFunction && (
              <button
                onClick={() => toggleFavorite(manga)}
                className="absolute top-1 right-1 p-2 bg-black h-9 bg-opacity-50 rounded-full flex items-center"
              >
                {favorites.some((fav) => fav.id === manga.id) ? (
                  <span className="text-pink-500 text-xl">❤️</span>
                ) : (
                  <span className="text-white text-xl mt-[2px]">🤍</span>
                )}
              </button>
            )}

            <Link className="overflow-hidden bg-yellow-500" href={manga.slug}>
              <Image
                width={187}
                height={268}
                src={manga.backgroundImage}
                alt={manga.name}
                className="h-[300px] w-full object-cover"
                loading="lazy"
              />
              <div className="py-4">
                <h2 className="text-lg font-semibold text-white text-ellipsis line-clamp-3">
                  {manga.name}
                </h2>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardSliderComponent;