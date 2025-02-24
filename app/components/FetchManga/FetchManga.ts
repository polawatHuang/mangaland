import { Manga, ProjectResponse } from "@/app/models/project";

export async function fetchManga(name: string): Promise<Manga | null> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/project/${name}`,
            {
                next: { revalidate: 60 }, // ISR: ดึงข้อมูลใหม่ทุก 60 วินาที
                cache: "force-cache", // ใช้ cache เพื่อลด API calls
            }
        );

        if (!res.ok) {
            console.error(`Failed to fetch manga: ${res.statusText}`);
            return null;
        }

        const data: ProjectResponse = await res.json();
        const project = data.result;

        if (!project) return null;

        return {
            id: project.id,
            slug: `/project/${project.slug}`,
            name: project.title,
            description: project.description,
            backgroundImage: project.coverImage,
            episodes: project.episodes.map((ep) => ({
                id: ep.id,
                episodeNumber: ep.episodeNumber,
                title: ep.title,
                description: ep.description,
                createdAt: ep.createdAt,
            })),
        };
    } catch (error) {
        console.error("Error fetching manga:", error);
        return null;
    }
}