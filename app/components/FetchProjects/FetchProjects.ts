import axios from "axios";

interface Project {
    id: number;
    slug: string;
    coverImage: string;
    title: string;
    status: string;
    viewsCount: number;
    createdAt: string;
}

interface MultiProjectResponse {
    result: {
        projects: Project[];
    };
}

interface Manga {
    id: number;
    slug: string;
    backgroundImage: string;
    name: string;
    status: string;
    viewsCount: number;
    createdAt: string;
}

const fetchProjects = async (): Promise<Manga[]> => {
    try {
        const { data } = await axios.get<MultiProjectResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/project`
        );

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const filterProjectsByMonthYear = (projects: Project[]) => {
            return projects.filter(project => {
                const projectDate = new Date(project.createdAt);
                return (
                    projectDate.getMonth() === currentMonth &&
                    projectDate.getFullYear() === currentYear
                );
            });
        };

        const sortProjectsByViews = (projects: Project[]) => {
            return projects.sort((a, b) => b.viewsCount - a.viewsCount);
        };

        const filteredProjects = filterProjectsByMonthYear(data.result.projects);
        const sortedProjects = sortProjectsByViews(filteredProjects);

        const topProjects = sortedProjects.slice(0, 5);

        return topProjects.map((project) => ({
            id: project.id,
            slug: `/project/${project.slug}`,
            backgroundImage: project.coverImage,
            name: project.title,
            status: project.status,
            viewsCount: project.viewsCount,
            createdAt: project.createdAt,
        }));
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
};

export { fetchProjects };