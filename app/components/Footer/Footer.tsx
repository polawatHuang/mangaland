"use client";

import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
/** @jsxImportSource @emotion/react */
import { useRouter } from "next/navigation";
import Link from "next/link";
import Wave from "react-wavify";
import axios from "axios";
import { Footer as IFooter, Setting } from "../../models/settings";

interface MenuItem {
    id: string;
    name: string;
    href: string;
}
interface DataURL {
    name: string;
    href: string;
}

const Footer: React.FC = () => {
    const [Data, setData] = useState<Setting>();
    const [footerData, setFooterData] = useState<IFooter>();
    const Data_Url = `${process.env.NEXT_PUBLIC_API_URL}/setting/1`;
    useEffect(() => {
        const fetchData = async () => {
            let data = (await axios.get(Data_Url)) as any;
            setData(data);
            setFooterData(data.result.footer);
            console.log(data);
        };
        fetchData();
        // setFooterData(
        //     footerData.filter((items: any) => {
        //         items["footer"];
        //     })
        // );
    }, []);
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
        <footer className="relative text-white pb-8 pt-14 h-full overflow-hidden flex flex-col ">
            <div className=" absolute z-[-1] bottom-0 left-0 w-full h-full">
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
            <div className=" absolute z-[-2] bottom-0 left-0 w-full h-full">
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
            <div className="container max-w-6xl px-4 mx-auto flex md:gap-4 gap-10 flex-wrap justify-start">
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
                                    <button className="hover:underline cursor-pointer">
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
                        {footerData &&
                            footerData.socials.map((social) => (
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
            <div className="text-center mt-5 text-sm">
                <p className="">
                    &copy; {dayjs().format("YYYY")} Mangaland. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
