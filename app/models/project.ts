import { BaseResponse } from ".";

export interface SingleProjectResponse extends BaseResponse {
    result: Project;
}

export interface MultiProjectResponse extends BaseResponse {
    result: ProjectResult;
}

export interface ProjectResult {
    projects: Project[];
    pagination: Pagination;
}

export interface Project {
    backgroundImage: any;
    id: number;
    title: string;
    slug: string;
    description: string;
    projectType: string;
    status: string;
    coverImage: string;
    viewsCount: number;
    episodeTotal: number;
    createdAt: string;
    user: User;
    episodes: any[];
    projectTags: any[];
    _count: Count;
}

export interface User {
    username: string;
}

export interface Count {
    views: number;
    favourites: number;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalProjects: number;
    perPage: number;
}

export interface Manga {
    id: number;
    slug: string;
    name: string;
    description: string;
    backgroundImage: string;
    episodes: Episode[];
}

export interface Episode {
    id: number;
    episodeNumber: number;
    title: string;
    description: string;
    createdAt: string;
}

export interface ProjectResponse {
    success: boolean;
    message: string;
    result: {
        project: ProjectProps[];
    };
    meta: {
        timestamp: string;
    };
}
export interface ProjectProps {
    id: number;
    title: string;
    slug: string;
    description: string;
    coverImage: string;
}
