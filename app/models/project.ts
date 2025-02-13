export interface ProjectResponse {
  success: boolean
  message: string
  data: ProjectData
}

export interface ProjectData {
  projects: Project[]
  pagination: Pagination
}

export interface Project {
  id: number
  title: string
  description: string
  projectType: string
  status: string
  coverImage: string
  viewsCount: number
  episodeTotal: number
  createdAt: string
  user: User
  episodes: Episode[]
  projectTags: ProjectTag[]
  _count: Count
}

export interface User {
  username: string
}

export interface Episode {
  id: number
  episodeNumber: number
  title: string
  description: string
  viewsCount: number
  createdAt: string
}

export interface ProjectTag {
  tagId: number
  projectId: number
}

export interface Count {
  views: number
  favourites: number
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalProjects: number
  perPage: number
}
