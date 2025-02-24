"use client";
import React, { useState, useEffect } from "react";
import style from "./NewManga.module.css";
import axios from "axios";
import { MultiProjectResponse, Project } from "../../../models/project";
import Card from "../../Card/Card";
import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface Manga {
    id: number;
    slug: string;
    backgroundImage: string;
    name: string;
    status: string;
}

function NewManga() {
    const [mangaList, setMangaList] = useState<Manga[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get<MultiProjectResponse>(
                    `${process.env.NEXT_PUBLIC_API_URL}/project`
                );
                const mappedMangaList = response.data.result.projects.map(
                    (project: Project) => ({
                        id: project.id,
                        slug: `/project/${project.slug}`,
                        backgroundImage: project.coverImage,
                        name: project.title,
                        status: project.status,
                    })
                );

                setMangaList(mappedMangaList);
            } catch (err) {
                setError("Failed to fetch projects");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className={`${style.item} ${style.NewMan} flex flex-col gap-3`}>
            <div className="flex justify-between items-center">
                <h2>มังงะมาใหม่</h2>
                <Link
                    href="/"
                    className="text-lg flex justify-center gap-1 items-center"
                >
                    ดูทั้งหมด
                    <div className="transition-all">
                        <ArrowLongRightIcon className="size-5" />
                    </div>
                </Link>
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className={`${style.CardGrid} grid gap-4 grid-cols-[repeat(auto-fill,150px)] grid-rows-2 justify-center items-center`}
            >
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {!loading && !error && mangaList.length > 0
                    ? mangaList
                          .filter((item) => item.status == "active")
                          .map((manga, index) => (
                              <motion.div
                                  key={index}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="w-[150px] h-[220px] overflow-hidden"
                              >
                                  <Card key={manga.id} manga={manga} />
                              </motion.div>
                          ))
                    : !loading && !error && <p>No manga found</p>}
            </motion.div>
        </div>
    );
}

export default NewManga;
