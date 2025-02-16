"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { TagLink } from "../../components/Tag/TagLink"
import { SortButton } from "../../components/Tag/SortButton"
import axios from "axios"
import { Tag, TagResonse } from "@/app/models/tag"

enum SortTags {
    ByCharactor = "by_char",
    Poplular = "by_popular"
}

export default function Tags() {
    const [sortBy, setSortBy] = useState<SortTags>(SortTags.ByCharactor)
    const [tags, setTags] = useState<Tag[]>([])

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const { data } = await axios.get<TagResonse>(`${process.env.NEXT_PUBLIC_API_URL}/tag`)

                setTags(data.result.tags)
            } catch (error) {
                console.log(error)
            }
        }

        fetchTags()
    }, [])

    const onChangeSort = useCallback((sortType: SortTags) => {
        setSortBy(sortType)
    }, [sortBy])

    const sortedTags = useMemo(() => {
        if (!tags.length) return []

        return [...tags].sort((a, b) =>
            sortBy === SortTags.ByCharactor
                ? a.name.localeCompare(b.name)
                : b._count.projectTags - a._count.projectTags
        )
    }, [tags.length, sortBy])

    return <div className="space-y-6">
        <h1 className="text-xl text-center">Tags</h1>

        <div className="flex w-full justify-center gap-4">
            <SortButton
                label="A-Z"
                onClick={() => onChangeSort(SortTags.ByCharactor)}
                isActive={sortBy === SortTags.ByCharactor}
            />

            <SortButton
                label="Popular"
                onClick={() => onChangeSort(SortTags.Poplular)}
                isActive={sortBy === SortTags.Poplular}
            />
        </div>

        <div className="bg-gray py-4 px-4 rounded-lg">
            {
                sortedTags.length === 0
                    ? <p className="text-center">No tags found.</p>
                    : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {
                            sortedTags.map((tag) =>
                                <TagLink
                                    name={tag.name}
                                    total={tag._count.projectTags}
                                    key={tag.name}
                                />
                            )
                        }
                    </div>
            }
        </div>
    </div>
}