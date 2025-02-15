"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

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
  description: string;
  projectType: string;
  status: string;
  coverImage: string;
  viewsCount: number;
  episodeTotal: number;
  createdAt: string;
  user: User;
  episodes: Episode[];
  _count: {
    views: number;
    favourites: number;
  };
}

interface APIResponse {
  success: boolean;
  message: string;
  data: {
    projects: Project[];
  };
}

export default function MangaCRUD() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    type: "Manga",
    status: "Ongoing",
    coverImage: "",
    userId: 1,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
      const data: APIResponse = await response.json();
      if (data.success) {
        setProjects(data.data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (response.ok) {
        fetchProjects();
        setNewProject({ title: "", description: "", type: "Manga", status: "Ongoing", coverImage: "", userId: 1 });
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-900 text-black rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Project Management</h1>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-bold mb-4">Add New Project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            className="p-2 bg-gray-700 rounded"
            required
          />
          <input
            type="text"
            placeholder="Cover Image URL"
            value={newProject.coverImage}
            onChange={(e) => setNewProject({ ...newProject, coverImage: e.target.value })}
            className="p-2 bg-gray-700 rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="p-2 bg-gray-700 rounded col-span-2"
            required
          ></textarea>
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-[#3a82f6] hover:bg-[#2b66c4] text-white rounded flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> Add Project
        </button>
      </form>

      {/* Manga List */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 p-4 rounded-lg flex items-start">
              <Image
                src={project.coverImage}
                width={100}
                height={150}
                alt={project.title}
                className="rounded-lg mr-4"
              />
              <div>
                <h2 className="text-xl font-bold">{project.title}</h2>
                <p className="text-sm text-gray-400">{project.description}</p>
                <p className="text-xs mt-2">Status: {project.status}</p>
                <p className="text-xs">Episodes: {project.episodeTotal}</p>
                <p className="text-xs">Views: {project.viewsCount}</p>
                <p className="text-xs">Author: {project.user.username}</p>
                <div className="flex gap-2 mt-2">
                  <button className="p-2 bg-yellow-600 rounded hover:bg-yellow-500">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-red-600 rounded hover:bg-red-500">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}