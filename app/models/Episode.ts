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
    title: string;
    description: string;
    viewsCount: number;
    createdAt: string;
    updatedAt: string;
    images: EpisodeImage[];
}

export interface EpisodePageProps {
    params: { name: string; episode: string };
}