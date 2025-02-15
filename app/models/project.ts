export interface ProjectResponse {
    success: boolean;
    message: string;
    result: Result;
    meta: Meta;
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

export interface Meta {
    timestamp: string;
}
