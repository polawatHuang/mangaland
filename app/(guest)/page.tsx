"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Advertise from "../components/Advertise/Advertise";
import { ScrollUp } from "../components/Footer/Scrollup";
import CardSliderComponent from "../components/Card/CardSlider";
import { Project, MultiProjectResponse } from "../models/project";

interface Manga {
    id: number;
    slug: string;
    backgroundImage: string;
    name: string;
}

export default function Home() {
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
                        slug: `/project/${project.id}`,
                        backgroundImage: project.coverImage,
                        name: project.title,
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
        <div>
            <Advertise />
            <div className="">
                <h2 className="">🔥 5 อันดับมังงะยอดฮิตประจำเดือนนี้</h2>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}

                {!loading && !error && (
                    <CardSliderComponent mangaList={mangaList.slice(0, 5)} />
                )}
            </div>
            <ScrollUp />
        </div>
    );
}
