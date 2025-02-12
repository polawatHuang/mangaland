"use client";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { Twirl as Hamburger } from "hamburger-react";
import "./Navbar.css";

function Navbars() {
    const Nav = [
        {
            title: "สุ่มมังงะ",
            link: "/",
        },
        {
            title: "แท็กทั้งหมด",
            link: "/",
        },
        {
            title: "มังฮวาเกาหลี",
            link: "/",
        },
        {
            title: "มังงะที่ถูกใจ",
            link: "/",
        },
    ];
    const [navOpen, setNavOpen] = useState(false);
    return (
        <nav className="flex relative justify-between items-center px-10 md:px-20 h-16 bg-gray text-white">
            <div className=" flex gap-2 cursor-default font-normal text-2xl">
                <span className="text-pink">MANGA</span>
                <span>LAND</span>
            </div>
            <div className=" md:hidden flex justify-center items-center">
                <button>
                    <Hamburger
                        size={30}
                        toggled={navOpen}
                        toggle={setNavOpen}
                    />
                </button>
                <div
                    className={`${
                        navOpen ? `h-80` : `h-0`
                    } w-full overflow-hidden absolute top-16 left-0 transition-all duration-700`}
                >
                    <ul className=" divide-y divide-[#ffffffaf] w-full flex flex-col">
                        {Nav.map((items, index) => (
                            <li key={index} className=" w-full flex">
                                <Link
                                    className="bg-gray w-full py-4 flex justify-center items-center"
                                    href={items.link}
                                    onClick={(e) => setNavOpen(!navOpen)}
                                >
                                    {items.title}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <div className="h-full flex">
                                <input
                                    type="text"
                                    className=" w-full h-16 bg-[#333333] outline-none text-white px-2"
                                    placeholder="ค้นหาชื่อมังงะ"
                                />
                                <button className="w-20 h-16 bg-blue hover:bg-[#2b61a8] flex justify-center items-center">
                                    <MagnifyingGlassIcon className=" size-5 h-full" />
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <ul className="md:flex Blurhover gap-5 hidden">
                {Nav.map((items, index) => (
                    <motion.li
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="Underline"
                    >
                        <Link href={items.link}>{items.title}</Link>
                    </motion.li>
                ))}
            </ul>
            <div className="md:flex hidden justify-center">
                <input
                    type="text"
                    className=" w-36 outline-none h-8 text-black px-2 rounded-l-md"
                    placeholder="ค้นหาชื่อมังงะ"
                />
                <button className="w-8 h-8 bg-blue hover:bg-[#2b61a8] flex justify-center items-center rounded-r-md">
                    <MagnifyingGlassIcon className=" size-5 h-full" />
                </button>
            </div>
        </nav>
    );
}

export default Navbars;
