import BlogWrapper from "@/components/wrapper/blog";

export async function generateMetadata({ params }) {
    const region = params?.region ?? "default";

    return {
        title: "Blogs",
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${
                region !== "default" ? `/${region}` : ""
            }/blog`
        }
    };
}

const Blog = async ({ params, searchParams }) => {
    const paramsValue = await searchParams;
    const preview = paramsValue?.preview === "true";

    // console.log("preview level 1: ", preview)
    
    const region = params.region;

    return (
        <>
            <BlogWrapper preview={preview} region={region} />
        </>
    );
};

export default Blog;