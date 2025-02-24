"use client";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Twirl as Hamburger } from "hamburger-react";
import axios from "axios";
import { NavbarItem } from "@/app/models/settings";
import { LayoutReturnResponse } from "@/app/models/server";
import Image from "next/image";
import logo from "../../../public/images/MoodengMangaWhite.png";

function Navbars() {
    const [navbar, setNavbar] = useState<NavbarItem[]>([]);
    const [navOpen, setNavOpen] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const { data } = await axios.get<LayoutReturnResponse>(
                "/api/layout"
            );
            setNavbar(data.navbar || data.result.navbar.items);
        } catch (error) {
            console.error("Failed to fetch navbar data:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <nav className="flex relative justify-between z-40 items-center px-10 lg:px-20 h-16 bg-[#111111] text-white">
            <div className="2xl:max-w-6xl w-full mx-auto flex justify-between items-center">
                <Link
                    href="/"
                    className="cursor-pointer flex gap-2 items-center font-normal text-2xl"
                >
                    <Image
                        src={logo}
                        className="w-16 block"
                        alt="logo"
                        priority
                    />
                    <div className="gap-2 lg:flex hidden">
                        <span className="text-pink [text-shadow:_#eb4897_2px_0_10px]">
                            MOODENG
                        </span>
                        <span className="[text-shadow:_white_2px_0_10px]">
                            MANGA
                        </span>
                    </div>
                    <div className="gap-2 lg:hidden block">
                        <span className="text-pink [text-shadow:_#eb4897_2px_0_10px]">
                            M
                        </span>
                        <span className="[text-shadow:_white_2px_0_10px]">
                            MANGA
                        </span>
                    </div>
                </Link>

                {/* Mobile Navigation */}
                <div className="lg:hidden flex items-center">
                    <button
                        aria-label="Toggle navigation menu"
                        className="bg-pink flex justify-center items-center h-16 w-16 hover:bg-[#bb3978]"
                        onClick={() => setNavOpen(!navOpen)}
                    >
                        <Hamburger
                            size={30}
                            toggled={navOpen}
                            toggle={setNavOpen}
                        />
                    </button>

                    <div
                        className={`absolute top-16 left-0 w-full transition-all duration-700 overflow-hidden ${
                            navOpen ? "h-96" : "h-0"
                        }`}
                    >
                        <ul className="w-full divide-y-2 divide-[#4e4e4e] flex flex-col">
                            {navbar &&
                                navbar.map((item, index) => (
                                    <li key={index} className="w-full flex">
                                        <Link
                                            href={item.link}
                                            className="w-full py-4 flex justify-center bg-[#3b3b3b] items-center text-white"
                                            onClick={() => setNavOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            <li>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full h-16 bg-[#333333] outline-none text-white px-2"
                                        placeholder="ค้นหาชื่อมังงะ"
                                    />
                                    <button className="w-20 h-16 bg-blue hover:bg-[#2b61a8] flex justify-center items-center">
                                        <MagnifyingGlassIcon className="size-5 h-full" />
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <ul className="lg:flex hidden gap-5">
                    {navbar &&
                        navbar.map((item, index) => (
                            <motion.li
                                key={index}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="Underline"
                            >
                                <Link href={item.link}>{item.title}</Link>
                            </motion.li>
                        ))}
                </ul>
                {/* Search Bar */}
                <div className="lg:flex hidden">
                    <input
                        type="text"
                        className="w-36 outline-none h-8 text-black px-2 rounded-l-lg"
                        placeholder="ค้นหาชื่อมังงะ"
                    />
                    <button className="w-8 h-8 bg-blue hover:bg-[#2b61a8] flex justify-center items-center rounded-r-lg">
                        <MagnifyingGlassIcon className="size-5 h-full" />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbars;
