"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
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

interface NewProject {
  title: string;
  description: string;
  type: string;
  tagIds: number[];
  status: string;
  coverImage: string;
  userId: number;
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
  const [newProject, setNewProject] = useState<NewProject>({
    title: "",
    description: "",
    type: "manga",
    tagIds: [],
    status: "active",
    coverImage: "",
    userId: 1,
  });

  const mangaTypeList = ["manga", "manhwa", "manhua", "webtoon", "other"];
  const statusList = ["active", "inactive", "pending"];

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
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects`
      );
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

  const handleTagChange = (selectedOptions: any) => {
    const selectedTagIds = selectedOptions.map((option: any) => option.value);
    setNewProject((prev) => ({
      ...prev,
      tagIds: selectedTagIds,
    }));
  };

  if (!hydrated) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-900 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-white">Project Management</h1>

      {/* Create Form */}
      <form
        onSubmit={(e) => e.preventDefault()} // Prevent default submission for now
        className="bg-[#2d313d] shadow p-4 rounded-lg mb-6"
      >
        <h2 className="text-lg font-bold mb-4 text-white">Add New Project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="text-white block mb-2">ชื่อเรื่อง:</label>
            <input
              type="text"
              placeholder="Title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              className="p-2 bg-gray-700 text-black w-full rounded"
              required
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="text-white block mb-2">URL รูปปกเรื่อง:</label>
            <input
              type="text"
              placeholder="Cover Image URL"
              value={newProject.coverImage}
              onChange={(e) =>
                setNewProject({ ...newProject, coverImage: e.target.value })
              }
              className="p-2 bg-gray-700 text-black w-full rounded"
              required
            />
          </div>

          {/* Manga Type Selection */}
          <div className="col-span-2 md:col-span-1">
            <label className="text-white block mb-2">ประเภทของโปรเจ็ค:</label>
            <select
              className="p-2 bg-gray-700 rounded text-black w-full"
              value={newProject.type}
              onChange={(e) =>
                setNewProject({ ...newProject, type: e.target.value })
              }
            >
              <option value={""} disabled>
                กรุณาเลือก Type ของ Project
              </option>
              {mangaTypeList.map((manga) => (
                <option key={manga} value={manga} className="text-black">
                  {manga}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="text-white block mb-2">Tags:</label>
            <Select
              key={hydrated ? "loaded" : "loading"} // Fixes hydration error
              isMulti
              options={tags?.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              onChange={handleTagChange}
              className="text-black"
            />
          </div>
          <div className="col-span-2">
            <label className="text-white block mb-2">เนื้อเรื่องย่อ:</label>
            <textarea
              placeholder="Description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="p-2 bg-gray-700 rounded text-black w-full"
              required
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-[#3a82f6] hover:bg-[#2b66c4] text-white rounded flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" /> Add Project
        </button>
      </form>
    </div>
  );
}
