import BlogWrapper from "@/components/wrapper/blog";

export const metadata = {
    title: "Blogs",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    },
}

const Blog = async ({ searchParams }) => {
    const params = await searchParams;
    const preview = params?.preview === "true";
    // console.log("preview level 1: ", preview)
    return (
        <>
            <BlogWrapper preview={preview} />
        </>
    );
};

export default Blog;