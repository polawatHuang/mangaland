export default function Tag({ params }: { params: { slug: string } }) {
    return <div>Tag: {params.slug}</div>;
}