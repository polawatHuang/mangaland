"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

// Lazy load react-select to prevent SSR mismatches
const Select = dynamic(() => import("react-select"), { ssr: false });

interface User {
  username: string;
}

interface Episode {
  id: number;
  episodeNumber: number;
  title: string;
  description: string;
  viewsCount: number;
  createdAt: string;
}

interface Project {
  id: number;
  title: string;
  type: string;
  description: string;
  projectType: string;
  status: string;
  tagIds: number[];
  slug: string;
  coverImage: string;
  viewsCount: number;
  episodeTotal: number;
  createdAt: string;
  user: User;
  episodes: Episode[];
}

interface APIResponse {
  success: boolean;
  message: string;
  result: {
    projects: Project[];
  };
}

interface Tag {
  id: number;
  name: string;
}

export default function MangaCRUD() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hydrated, setHydrated] = useState(false);
  const [newProject, setNewProject] = useState<{
    title: string;
    description: string;
    type: string;
    slug: string;
    tagIds: number[];
    status: string;
    coverImage: string;
    userId: number;
  }>({
    title: "",
    description: "",
    type: "manga",
    slug: "",
    tagIds: [],
    status: "active",
    coverImage: "",
    userId: 1,
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    setHydrated(true);
    fetchTags();
    fetchProjects();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tag`);
      const data = await response.json();
      setTags(data.result.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/project`
      );
      const data: APIResponse = await response.json();
      if (data.success) {
        setProjects(data.result.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = (selectedOptions: any) => {
    const selectedTagIds = selectedOptions.map((option: any) => option.value);
    setNewProject((prev) => ({
      ...prev,
      tagIds: selectedTagIds,
    }));
  };

  const handleCreateProject = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/project`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject),
        }
      );

      if (!response.ok) throw new Error("Failed to create project");

      setNewProject({
        title: "",
        description: "",
        type: "manga",
        tagIds: [],
        slug: "",
        status: "active",
        coverImage: "",
        userId: 1,
      });
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/project/${editingProject.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        }
      );

      if (!response.ok) throw new Error("Failed to update project");

      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete project");

      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (!hydrated) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-900 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-white">Project Management</h1>

      {/* Create / Edit Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editingProject ? handleUpdateProject() : handleCreateProject();
        }}
        className="bg-[#2d313d] shadow p-4 rounded-lg mb-6"
      >
        <h2 className="text-lg font-bold mb-4 text-white">
          {editingProject ? "Edit Project" : "Add New Project"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={editingProject ? editingProject.title : newProject.title}
            onChange={(e) =>
              editingProject
                ? setEditingProject({
                    ...editingProject,
                    title: e.target.value,
                  })
                : setNewProject({ ...newProject, title: e.target.value })
            }
            className="p-2 bg-gray-700 text-black w-full rounded"
            required
          />
          <input
            type="text"
            placeholder="Cover Image URL"
            value={
              editingProject ? editingProject.coverImage : newProject.coverImage
            }
            onChange={(e) =>
              editingProject
                ? setEditingProject({
                    ...editingProject,
                    coverImage: e.target.value,
                  })
                : setNewProject({ ...newProject, coverImage: e.target.value })
            }
            className="p-2 bg-gray-700 text-black w-full rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={
              editingProject
                ? editingProject.description
                : newProject.description
            }
            onChange={(e) =>
              editingProject
                ? setEditingProject({
                    ...editingProject,
                    description: e.target.value,
                  })
                : setNewProject({ ...newProject, description: e.target.value })
            }
            className="p-2 bg-gray-700 text-black w-full rounded"
            required
          />
          <input
            type="text"
            placeholder="Type"
            value={editingProject ? editingProject.type : newProject.type}
            onChange={(e) =>
              editingProject
                ? setEditingProject({ ...editingProject, type: e.target.value })
                : setNewProject({ ...newProject, type: e.target.value })
            }
            className="p-2 bg-gray-700 text-black w-full rounded"
            required
          />
          <input
            type="text"
            placeholder="Tags"
            value={
              editingProject && Array.isArray(editingProject.tagIds)
                ? editingProject.tagIds.join(", ")
                : newProject.tagIds.join(", ")
            }
            onChange={(e) => {
              const tagValues = e.target.value
                .split(",")
                .map((id) => parseInt(id.trim(), 10))
                .filter((id) => !isNaN(id));
              editingProject
                ? setEditingProject({ ...editingProject, tagIds: tagValues })
                : setNewProject({ ...newProject, tagIds: tagValues });
            }}
            className="p-2 bg-gray-700 text-black w-full rounded"
            required
          />

          <input
            type="text"
            placeholder="Slug"
            value={editingProject ? editingProject.slug : newProject.slug}
            onChange={(e) =>
              editingProject
                ? setEditingProject({ ...editingProject, slug: e.target.value })
                : setNewProject({ ...newProject, slug: e.target.value })
            }
            className="p-2 bg-gray-700 text-black w-full rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {editingProject ? "Update Project" : "Add Project"}
        </button>
      </form>

      {/* Project List */}
      <h2 className="text-xl font-bold mb-4 text-white">Project List</h2>
      {loading ? (
        <p className="text-center text-white">Loading projects...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#2d313d] p-4 rounded-lg shadow-lg"
            >
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <h3 className="text-lg font-bold text-white line-clamp-1">
                {project.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-3 mt-2">
                {project.description}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setEditingProject(project)}
                  className="text-[#3a82f6] hover:text-[#609cfc]"
                >
                  <PencilIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-[#ff0505] hover:text-[#f54040]"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
