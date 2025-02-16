'use client';

import { motion } from "framer-motion";
import { Project } from "@/app/models/project";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState, use } from "react";

export default function Tag({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        if (!slug) return

        const fetchProjectTagByName = async (name: string) => {
            try {
                const { data } = await axios.get<Project[]>(`/api/tag/${name}`);

                setProjects(data);
            } catch (error) {
                console.log("Error fetching projects:", error);
            }
        };

        fetchProjectTagByName(slug)
    }, [slug]);

    return <div>
        <h1 className="text-lg font-semibold">Tag: {slug}</h1>

        <div className="group">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {
                    projects.length > 0 ? (
                        projects.map((project) =>
                            <motion.div
                                key={project.id}
                                className="flex flex-col items-center justify-center my-2 group-hover:opacity-50 hover:!opacity-100 group-hover:blur-sm hover:!blur-0 transition-opacity"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Image
                                    src={project.coverImage}
                                    alt={project.title}
                                    width={187}
                                    height={268}
                                    className="w-3/4 max-w-52 h-auto object-cover"
                                />
                                <span className="text-lg font-semibold text-white text-ellipsis line-clamp-3">{project.title}</span>
                            </motion.div>
                        )
                    ) : (
                        <p>No projects found.</p>
                    )
                }
            </div>
        </div>

    </div>
}