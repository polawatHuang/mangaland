import AdsCard from "../AdsCard/AdsCard";
interface AdItem {
    id: number;
    img: string;
    name: string;
    href: string;
}

interface AdsCardProps {
    adItems?: AdItem[];
}

const Advertise: React.FC<AdsCardProps> = () => {
    const adItems: AdItem[] = [
        { id: 1, img: "/ads/ads-1.gif", name: "ads 1", href: "/" },
        { id: 2, img: "/ads/ads-2.webp", name: "ads 2", href: "/" },
        { id: 3, img: "/ads/ads-3.webp", name: "ads 3", href: "/" },
        { id: 4, img: "/ads/ads-4.webp", name: "ads 4", href: "/" },
        { id: 5, img: "/ads/ads-5.webp", name: "ads 5", href: "/" },
        { id: 6, img: "/ads/ads-6.webp", name: "ads 6", href: "/" },
    ];

    return (
        <div className="w-full max-w-6xl px-2 container mx-auto">
            <AdsCard adItems={adItems} />
        </div>
    );
};
export default Advertise;
