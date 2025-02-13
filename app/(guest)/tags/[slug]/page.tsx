type Params = Promise<{ slug: string }>;

export default async function Tag({ params }: { params: Params }) {
    const { slug } = await params;

    return <div>Tag: {slug}</div>;
}