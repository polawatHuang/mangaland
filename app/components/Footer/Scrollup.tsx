"use client";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export const ScrollUp = () => {
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

    return <button
        onClick={scrollToTop}
        className={`${isVisible ? `opacity-100` : `opacity-0`
            } fixed right-10 z-50 bottom-10 md:right-20 md:bottom-20 bg-pink w-10 h-10 rounded-full Arrow`}
    >
        <ChevronUpIcon className="size-10" />
    </button>
}