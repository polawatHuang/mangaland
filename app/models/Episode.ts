export interface EpisodeImage {
    id: number;
    episodeId: number;
    imageNumber: number;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface EpisodeData {
    id: number;
    projectId: number;
    episodeNumber: number;
    projectTitle: string;
    title: string;
    description: string;
    viewsCount: number;
    createdAt: string;
    updatedAt: string;
    images: EpisodeImage[];
    project: ProjectProps;
}

interface ProjectProps {
    title: string | null;
    slug: string;
}
export interface EpisodePageProps {
    params: Promise<{
        name: string;
        episode: string;
    }>;
}
