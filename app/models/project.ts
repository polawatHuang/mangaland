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
