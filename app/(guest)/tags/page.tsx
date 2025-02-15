import { useCallback, useMemo, useState } from "react"
import { TagLink } from "../../components/Tag/TagLink"
import { SortButton } from "../../components/Tag/SortButton"
import axios from "axios"

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

export default async function Tags() {
    const [sortBy, setSortBy] = useState<SortTags>(SortTags.ByCharactor)
    const [tags, _] = useState<ITag[]>(TagsMockUp)

    const fetchTags = useMemo(async () => {
        try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tag`)

            return data
        } catch (error) {
            console.log(error)
        }
    }, [])

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