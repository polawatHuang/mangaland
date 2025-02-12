import React from "react";

interface AdItem {
    id: number;
    img: string;
    name: string;
}

interface AdsCardProps {
    adItems?: AdItem[];
}

const AdsCard: React.FC<AdsCardProps> = ({ adItems = [] }) => {
    const defaultAdItems: AdItem[] = [
        { id: 1, img: "/images/test.png", name: "test" },
        { id: 2, img: "/images/test.png", name: "test" },
    ];

    const displayItems = adItems.length > 0 ? adItems : defaultAdItems;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-[60px]">
            {displayItems.map((item) => (
                <div
                    key={item.id}
                    className="h-[140px] bg-green flex flex-col items-center justify-center"
                >
                    <span className="text-5xl opacity-[0.5]">พื้นที่โฆษณา</span>
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
