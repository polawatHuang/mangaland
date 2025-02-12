import React from "react";
import Image from "next/image";
import "./AdsCards.css";
import Link from "next/link";
interface AdItem {
    id: number;
    img: string;
    name: string;
    href: string;
}

interface AdsCardProps {
    adItems?: AdItem[];
}

const AdsCard: React.FC<AdsCardProps> = ({ adItems = [] }) => {
    const defaultAdItems: AdItem[] = [
        { id: 1, img: "/images/test.png", name: "test", href: "/" },
        { id: 2, img: "/images/test.png", name: "test", href: "/" },
    ];
    return (
        <div className="flex flex-wrap gap-4 justify-center mb-[60px] ">
            {adItems.length > 0 &&
                adItems.map((item) => (
                    <Link
                        href={item.href}
                        key={item.id}
                        className=" md:w-[45%]  items-center justify-center CardAnime relative"
                    >
                        <Image
                            src={item.img}
                            alt={item.name}
                            width={718}
                            height={198}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                        />
                    </Link>
                ))}
            {adItems.length === 0 &&
                defaultAdItems.map((item) => (
                    <div
                        key={item.id}
                        className="h-[140px] flex flex-col items-center justify-center"
                    >
                        <span className="text-5xl opacity-[0.5]">
                            พื้นที่โฆษณา
                        </span>
                        <span className="opacity-[0.5] text-center">
                            678 px * 140 px (สนใจโฆษณา email:
                            kaitolovemiku@hotmail.com)
                        </span>
                    </div>
                ))}
        </div>
    );
};

export default AdsCard;
