'use client';

import { Project } from "@/app/models/project";
import axios from "axios";
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
        {
            projects.length > 0 ? (
                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>{project.title}</li>
                    ))}
                </ul>
            ) : (
                <p>No projects found.</p>
            )
        }
    </div>
}