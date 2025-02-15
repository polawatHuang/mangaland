"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ITag } from "@/app/(guest)/tags/page";

export function TagLink({ name, total }: ITag) {
    return (
        <Link href={`/tags/${name}`}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.9 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                    duration: 3,
                }}
                className="bg-light_gray rounded-lg px-4 py-1"
            >
                <div className="flex justify-between">
                    <span className="text-md">{name}</span>
                    <span className="bg-black bg-opacity-50 rounded-full px-2">
                        {total}
                    </span>
                </div>
            </motion.div>
        </Link>
    );
}
