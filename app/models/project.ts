import { BaseResponse } from ".";

export interface ProjectResponse extends BaseResponse {
    status: number;
}

export interface Result {
    projects: Project[];
    pagination: Pagination;
}

export interface Project {
    id: number;
    title: string;
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