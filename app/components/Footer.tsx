"use client";

import { goToRandomManga } from "@/libs/goToRandomManga";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
/** @jsxImportSource @emotion/react */
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MenuItem {
    id: string;
    name: string;
    href: string;
}

const Footer: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [socialLinks, setSocialLinks] = useState<MenuItem[]>([]);
    const router = useRouter();

    useEffect(() => {
        // const fetchMenuItems = async () => {
        //   try {
        //     const response = await fetch("/api/menubar");
        //     const data: MenuItem[] = await response.json();
        //     setMenuItems(data);
        //   } catch (error) {
        //     console.error("Error fetching menu items:", error);
        //   }
        // };

        // fetchMenuItems();
        const data = [
            { id: "1", name: "สุ่มมังงะ", href: "/" },
            { id: "2", name: "แท็กทั้งหมด", href: "/categories" },
            { id: "3", name: "มังฮวาเกาหลี", href: "/popular" },
            { id: "4", name: "มังงะที่ถูกใจ", href: "/" },
        ];
        const socials = [
            { id: "1", name: "Facebook", href: "https://facebook.com" },
            { id: "2", name: "Twitter", href: "https://twitter.com" },
            { id: "3", name: "Instagram", href: "https://instagram.com" },
        ];
        setMenuItems(data);
        setSocialLinks(socials);
    }, []);

    return (
        <footer className="bg-gray text-white py-8">
            <div className="container px-4 mx-auto flex md:gap-4 gap-10 flex-wrap justify-start">
                <div className="flex-1 sm:w-1/3 mb-6 sm:mb-0">
                    <h4 className="text-lg font-semibold mb-2">เกี่ยวกับเรา</h4>
                    <p>
                        MANGALAND
                        คือเว็บไซต์อ่านการ์ตูนออนไลน์ที่ออกแบบมาให้ใช้งานง่าย
                        สะดวก รวดเร็ว พร้อมอัปเดตมังงะใหม่ทุกวัน!
                        พบกับมังงะหลากหลายแนว ทั้งแอ็กชัน โรแมนซ์ แฟนตาซี
                        และอีกมากมาย ทุกเรื่องแปลไทยให้อ่านฟรี คุณภาพคมชัด
                        โหลดไว ไม่พลาดทุกตอนสำคัญ!
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
                <div className="flex-1 sm:w-1/3 mb-6 sm:mb-0">
                    <h4 className="text-lg font-semibold mb-2">เมนู</h4>
                    <ul>
                        {menuItems
                            .filter(
                                (item) => item.name !== "สุ่มเลือกอ่านมังงะ"
                            )
                            .map((item) => (
                                <li key={item.id} className="mb-2">
                                    <a
                                        href={item.href}
                                        className="hover:underline"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        {menuItems
                            .filter(
                                (item) => item.name === "สุ่มเลือกอ่านมังงะ"
                            )
                            .map((item) => (
                                <li key={item.id} className="mb-2">
                                    <button
                                        onClick={() => goToRandomManga(router)}
                                        className="hover:underline cursor-pointer"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="flex-1 sm:w-1/3">
                    <h4 className="text-lg font-semibold mb-2">
                        ติดตามเราได้ที่
                    </h4>
                    <div className="flex space-x-4">
                        {socialLinks.map((social) => (
                            <Link
                                key={social.id}
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
            <div className="mt-8 text-center text-sm">
                <p>
                    &copy; {dayjs().format("YYYY")} Mangaland. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
