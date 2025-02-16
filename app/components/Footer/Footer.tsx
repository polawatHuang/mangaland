"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import axios from "axios";
import { Footer as IFooter, NavbarItem } from "../../models/settings";
import { LayoutReturnResponse } from "@/app/models/server";

// Lazy load heavy components
const Wave = dynamic(() => import("react-wavify"), { ssr: false });

const Footer: React.FC = () => {
    const [menuItems, setMenuItems] = useState<NavbarItem[]>([]);
    const [footer, setFooter] = useState<IFooter | null>(null);

    // Fetch data only when needed
    const fetchData = useCallback(async () => {
        try {
            const { data } = await axios.get<LayoutReturnResponse>(
                "/api/layout"
            );
            setMenuItems(data.navbar || []);
            setFooter(data.footer || null);
        } catch (error) {
            console.error("Failed to fetch footer data:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <footer className="relative text-white pb-8 pt-14 h-full overflow-hidden flex flex-col">
            {/* Lazy load wave background */}
            <Suspense
                fallback={
                    <div className="absolute z-[-1] bottom-0 left-0 w-full h-full bg-gray-900" />
                }
            >
                <div className="absolute z-[-1] bottom-0 left-0 w-full h-full">
                    <Wave
                        fill="#1f2936"
                        paused={false}
                        className="flex h-full w-full"
                        options={{
                            height: 10,
                            amplitude: 30,
                            speed: 0.15,
                            points: 3,
                        }}
                    />
                </div>
                <div className="absolute z-[-2] bottom-0 left-0 w-full h-full">
                    <Wave
                        fill="#eb4897"
                        paused={false}
                        className="flex h-full w-full"
                        options={{
                            height: 10,
                            amplitude: 40,
                            speed: 0.15,
                            points: 3,
                        }}
                    />
                </div>
            </Suspense>

            <div className="container max-w-6xl px-4 mx-auto flex md:gap-4 gap-10 flex-wrap justify-start">
                {/* About Section */}
                <div className="flex-1 sm:w-1/3 mb-6 sm:mb-0">
                    <h4 className="text-lg font-semibold mb-2">เกี่ยวกับเรา</h4>
                    <p>
                        MANGALAND
                        คือเว็บไซต์อ่านการ์ตูนออนไลน์ที่ออกแบบมาให้ใช้งานง่าย
                        สะดวก รวดเร็ว พร้อมอัปเดตมังงะใหม่ทุกวัน!
                    </p>
                    <p className="mt-4">
                        ติดต่อโฆษณา:{" "}
                        <a
                            href="mailto:kaitolovemiku@hotmail.com"
                            target="_blank"
                        >
                            kaitolovemiku@hotmail.com
                        </a>
                    </p>
                </div>

                {/* Menu Section */}
                <div className="flex-1 sm:w-1/3 mb-6 sm:mb-0">
                    <h4 className="text-lg font-semibold mb-2">เมนู</h4>
                    <ul>
                        {menuItems
                            ?.filter(
                                (item) => item.title !== "สุ่มเลือกอ่านมังงะ"
                            )
                            .map((item) => (
                                <li key={item.title} className="mb-2">
                                    <Link
                                        href={item.link}
                                        className="hover:underline"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        {menuItems
                            ?.filter(
                                (item) => item.title === "สุ่มเลือกอ่านมังงะ"
                            )
                            .map((item) => (
                                <li key={item.title} className="mb-2">
                                    <button className="hover:underline cursor-pointer">
                                        {item.title}
                                    </button>
                                </li>
                            ))}
                    </ul>
                </div>

                {/* Social Links Section */}
                <div className="flex-1 sm:w-1/3">
                    <h4 className="text-lg font-semibold mb-2">
                        ติดตามเราได้ที่
                    </h4>
                    <div className="flex space-x-4">
                        {footer?.socials.map((social) => (
                            <Link
                                key={social.href}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                {social.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Copyright */}
            <div className="text-center mt-5 text-sm">
                <p>
                    &copy; {new Date().getFullYear()} Mangaland. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
