import NotFound from "@/app/(default)/not-found";
import StructuredData from "@/components/StructuredData";
import SingleBlogWrapper from "@/components/wrapper/single-blog"
import { getBlog } from "@/libs/apis/data/blog";
import { redirect } from "next/navigation";

// Centralized data fetcher
async function fetchBlogData(params, searchParams) {
    const preview = searchParams?.preview === "true";
    const slug = params?.slug;
    const blogsResponse = await getBlog(preview, slug);

    return { blogsResponse, preview, slug };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
    const { blogsResponse, slug } = await fetchBlogData(params, searchParams);

    if (!blogsResponse) {
        return {
            title: "Blog Not Found",
            description: "The requested blog post could not be found.",
        };
    }

    const seo = blogsResponse?.data?.[0]?.seo || {};
    // console.log("Seo: ", seo)

    return {
        title: seo?.metaTitle || blogsResponse?.data?.[0]?.title,
        description: seo?.metaDescription || blogsResponse?.data?.[0]?.excerpt,
        keywords: seo?.keywords ? seo?.keywords.split(",").map((k) => k.trim()) : [],
        alternates: {
            canonical:
                seo?.canonicalURL ||
                `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}/blog/${slug}/`,
        },
        openGraph: {
            title: seo?.openGraph?.ogTitle,
            description: seo?.openGraph?.ogDescription,
            url: seo?.openGraph?.ogUrl,
            images: [
                {
                    url: seo?.openGraph?.ogImage?.url,
                    width: seo?.openGraph?.ogImage?.width,
                    height: seo?.openGraph?.ogImage?.height,
                    alt: seo?.openGraph?.ogImage?.alternativeText || "DWAO Image",
                },
            ],
            type: seo?.openGraph?.ogType || "website",
        },
    };
}

const SingleBlog = async ({ params, searchParams }) => {
    const { blogsResponse, preview } = await fetchBlogData(params, searchParams);

    if (blogsResponse.status === "error") {
        return <div className="">Something went wrong!! Please try again later.</div>;
    } else if (blogsResponse.status === "not_found") {
        return redirect("/");
    }

    return (
        <>
            <StructuredData data={blogsResponse?.data?.[0]?.seo?.structuredData} />
            <SingleBlogWrapper
                pageData={blogsResponse?.data[0]}
                relatedBlogs={blogsResponse?.related}
                preview={preview}
            />
        </>
    );
};

export default SingleBlog;
