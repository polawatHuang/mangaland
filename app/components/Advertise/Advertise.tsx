import AdsCard from "../AdsCard/AdsCard";
interface AdItem {
    id: number;
    img: string;
    name: string;
  }
  
  interface AdsCardProps {
    adItems?: AdItem[];
  }

const Advertise:React.FC<AdsCardProps> = () => {
    const adItems: AdItem[] = [
        { id: 1, img: "/ads/ads-1.gif", name: "ads 1" },
        { id: 2, img: "/ads/ads-2.webp", name: "ads 2" },
        { id: 3, img: "/ads/ads-3.webp", name: "ads 3" },
        { id: 4, img: "/ads/ads-4.webp", name: "ads 4" },
        { id: 5, img: "/ads/ads-5.webp", name: "ads 5" },
        { id: 6, img: "/ads/ads-6.webp", name: "ads 6" },
      ];
    
  return (
    <div className="w-full max-w-6xl container mx-auto">
      <AdsCard adItems={adItems} />
    </div>
  );
};
export default Advertise;
