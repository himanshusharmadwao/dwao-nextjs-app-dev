import BlogWrapper from "@/components/wrapper/blog";

export const metadata = {
    title: "Blogs",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    },
}

const Blog = () => {
    return (
        <>
            <BlogWrapper />
        </>
    );
};

export default Blog;