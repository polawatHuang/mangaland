import { SingleProjectResponse } from "@/app/models/project"
import { TagResonse } from "@/app/models/tag"
import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

type Params = { params: Promise<{ slug: string }> }

const fetchTags = async () => {
    try {
        const { data } = await axios.get<TagResonse>(`${process.env.NEXT_PUBLIC_API_URL}/tag`)

        return data.result.tags
    } catch (error) {
        console.log(error)
    }
}

export async function GET(request: NextRequest, { params }: Params) {
    const { slug } = await params

    const tags = await fetchTags()

    if (!tags || !tags.length) return NextResponse.json({ message: "Tags not found" }, { status: 404 })

    const tag = tags.find((tag) => tag.name === slug)

    if (!tag) return NextResponse.json({ message: "Tag not found" }, { status: 404 })

    const projects = await Promise.all(
        tag.projectTags.map(async (projectTag) => {
            const { data } = await axios.get<SingleProjectResponse>(`${process.env.NEXT_PUBLIC_API_URL}/project/${projectTag.projectId}`)

            return data.result
        })
    )

    return NextResponse.json(projects)
}