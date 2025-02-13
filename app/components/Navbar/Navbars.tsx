"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Twirl as Hamburger } from "hamburger-react";
import "./Navbar.css";
import axios from "axios";
import { NavbarItem } from "@/app/models/settings";

function Navbars() {
    const [navbar, setNavbar] = useState<NavbarItem[]>([]);
    const [navOpen, setNavOpen] = useState(false);

    const fetchNavbar = async () => {
        const { data } = await axios.get<NavbarItem[]>(`/api/navbar`);

        setNavbar(data);
    };

    useEffect(() => {
        fetchNavbar()
    }, [])

    return (
        <nav className="flex relative justify-between z-40 items-center px-10 lg:px-20 h-16 bg-gray text-white">
            <div className=" 2xl:max-w-6xl w-full mx-auto overflow-hidden flex justify-between items-center">
                <div className=" flex gap-2 cursor-default font-normal text-2xl relative">
                    <span className="text-pink [text-shadow:_#eb4897_2px_0_10px]">
                        MANGA
                    </span>
                    <span className="[text-shadow:_white_2px_0_10px]">
                        LAND
                    </span>
                </div>
                <div className=" lg:hidden bg-pink flex justify-center items-center h-16 w-16 hover:bg-[#bb3978] ">
                    <button className="h-full">
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
                        <ul className=" w-full divide-y-2 divide-[#4e4e4e] flex flex-col">
                            {navbar.map((items, index) => (
                                <li key={index} className=" w-full flex">
                                    <Link
                                        className=" bg-[#3b3b3b] w-full py-4 flex justify-center items-center"
                                        href={items.link}
                                        onClick={() => setNavOpen(!navOpen)}
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
                <ul className="lg:flex Blurhover gap-5 hidden">
                    {navbar.map((items, index) => (
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
                <div className="lg:flex hidden justify-center">
                    <input
                        type="text"
                        className=" w-36 outline-none h-8 text-black px-2 rounded-l-lg"
                        placeholder="ค้นหาชื่อมังงะ"
                    />
                    <button className="w-8 h-8 bg-blue hover:bg-[#2b61a8] flex justify-center items-center rounded-r-lg">
                        <MagnifyingGlassIcon className=" size-5 h-full" />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbars;
