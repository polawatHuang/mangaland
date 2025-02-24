"use client";
import React from "react";
import style from "./TagManga.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

interface Tag {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    projectTags: any[];
    _count: {
        projectTags: number;
    };
}

interface Result {
    result: any;
    tags: Tag[];
}

function TopManga() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [tagLists, setTagLists] = useState<Tag[]>([]);

    useEffect(() => {
        const fetchProjectTagByName = async () => {
            try {
                const data = await axios.get<Result>(
                    `${process.env.NEXT_PUBLIC_API_URL}/tag`
                );
                setTagLists(data.data.result.tags);
            } catch (error) {
                console.log("Error fetching tags:", error);
                setError("Failed to fetch tags");
            }
        };

        fetchProjectTagByName();
    }, []);
    return (
        <div className={`${style.item} flex flex-col gap-3 Tag`}>
            <h2>Tag</h2>
            <div className="flex gap-2 w-full flex-col">
                {tagLists.length > 0
                    ? tagLists.map((tag, index) => (
                          <motion.div
                              key={index}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                          >
                              <Link
                                  href={`/tags/${tag.name}`}
                                  className="bg-gray w-full p-3 rounded-md flex justify-center items-center"
                                  key={tag.id}
                              >
                                  {tag.name}
                              </Link>
                          </motion.div>
                      ))
                    : "No tags available"}
            </div>
        </div>
    );
}

export default TopManga;
