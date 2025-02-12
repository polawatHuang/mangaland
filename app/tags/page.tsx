"use client"

import { useCallback, useMemo, useState } from "react"
import { TagLink } from "../components/Tag/TagLink"

enum SortTags {
    ByCharactor = "by_char",
    Poplular = "by_popular"
}

export interface ITag {
    name: string,
    total: number
}

const TagsMockUp: ITag[] = [
    {
        name: "3d",
        total: 10
    },
    {
        name: "anime",
        total: 2
    },
    {
        name: "manga",
        total: 6
    },
    {
        name: "romance",
        total: 15
    },
    {
        name: "action",
        total: 5
    }
]

export default function Tags() {
    const [sortBy, setSortBy] = useState<SortTags>(SortTags.ByCharactor)
    const [tags, _] = useState<ITag[]>(TagsMockUp)

    const onChangeSort = useCallback((sortType: SortTags) => {
        setSortBy(sortType)
    }, [sortBy])

    const sortedTags = useMemo(() => {
        return [...tags].sort((a, b) =>
            sortBy === SortTags.ByCharactor
                ? a.name.localeCompare(b.name)
                : b.total - a.total
        )
    }, [sortBy])

    return <div className="space-y-6">
        <h1 className="text-xl text-center">Tags</h1>

        <div className="flex w-full justify-center gap-4">
            <div className={`flex items-center bg-gray rounded-md px-4 py-2`}>
                <button onClick={() => onChangeSort(SortTags.ByCharactor)}>A - Z</button>
            </div>

            <div className={`flex items-center bg-gray rounded-md px-4 py-2`}>
                <button onClick={() => onChangeSort(SortTags.Poplular)}>Popular</button>
            </div>
        </div>

        <div className="bg-gray py-2 px-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {
                    sortedTags.map((tag) =>
                        <TagLink
                            name={tag.name}
                            total={tag.total}
                            key={tag.name}
                        />
                    )
                }
            </div>
        </div>
    </div>
}