"use client";
import Advertise from "./components/Advertise/Advertise";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { Typography } from "antd";
import { gray } from "@ant-design/colors";

const { Title } = Typography;

export default function Home() {
    const [isVisible, setIsVisible] = useState(false);

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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return (
        <div>
            <Advertise />
            <div>
                <h2>🔥 5 อันดับมังงะยอดฮิตประจำเดือนนี้</h2>
            </div>
            <button
                onClick={scrollToTop}
                className={`${
                    isVisible ? `opacity-100` : `opacity-0`
                } fixed right-10 bottom-10 md:right-20 md:bottom-20 bg-pink w-10 h-10 rounded-full Arrow`}
            >
                <ChevronUpIcon className="size-10" />
            </button>
        </div>
    );
}
