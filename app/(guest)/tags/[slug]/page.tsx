"use client";

import { motion } from "framer-motion";
import { Project } from "@/app/models/project";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState, use } from "react";
import Card from "../../../components/Card/Card";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import styles from "../../../components/MangaReader/MangaReader.module.css";

interface Manga {
    id: number;
    slug: string;
    backgroundImage: string;
    status: string;
    name: string;
}

export default function Tag({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [projects, setProjects] = useState<Manga[]>([]);

    useEffect(() => {
        if (!slug) return;

        const fetchProjectTagByName = async (name: string) => {
            try {
                const { data } = await axios.get<Project[]>(`/api/tag/${name}`);
                const mappedMangaList = data.map((project: Project) => ({
                    id: project.id,
                    slug: `/project/${project.id}`,
                    backgroundImage: project.coverImage,
                    status: project.status,
                    name: project.title,
                }));
                setProjects(mappedMangaList);
                console.log(mappedMangaList);
            } catch (error) {
                console.log("Error fetching projects:", error);
            }
        };

        fetchProjectTagByName(slug);
    }, [slug]);

    return (
        <div className="px-4 flex flex-col gap-4">
            <div className="flex w-full justify-between">
                <h1 className="text-lg font-semibold ">Tag: {slug}</h1>
                <Link
                    href={`/`}
                    className={`${styles.circle} absolute top-0 left-3 [z-index:9999] md:left-0 md:relative p-[2px]`}
                >
                    <ArrowUturnLeftIcon className="size-8 p-1 bg-black rounded-full z-20 relative" />
                </Link>
            </div>

            <div className="group">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <motion.div
                                key={project.id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-[150px] h-[220px] overflow-hidden"
                            >
                                <Card key={project.id} manga={project} />
                            </motion.div>
                        ))
                    ) : (
                        <p>No projects found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
