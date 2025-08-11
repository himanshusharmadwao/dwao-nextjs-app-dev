import NotFound from "@/app/(default)/not-found";
import StructuredData from "@/components/StructuredData";
import SingleBlogWrapper from "@/components/wrapper/single-blog"
import { getBlog } from "@/libs/apis/data/blog";

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const preview = resolvedSearchParams?.preview === "true";
    const region = resolvedParams.region || "default";
    const blogsResponse = await getBlog(preview, resolvedParams.slug, region);

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
        keywords: seo?.keywords ? seo?.keywords.split(',').map(keyword => keyword.trim()) : [],
        alternates: {
            canonical: seo?.canonicalURL ||
                `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${
                    region !== "default" ? `/${region}` : ""
                }/blog/${resolvedParams.slug}`
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
                    alt: seo?.openGraph?.ogImage?.alternativeText || 'DWAO Image',
                },
            ],
            type: seo?.openGraph?.ogType || 'website'
        }
    };
}

const SingleBlog = async ({ params, searchParams }) => {

    const resolvedParams = await params;

    const resolvedSearchParams = await searchParams;

    const preview = resolvedSearchParams?.preview === "true";

    const region = resolvedParams.region || "default";

    const blogsResponse = await getBlog(preview, resolvedParams.slug, region);

    if (!blogsResponse) {
        return <NotFound />
    }

    return (
        <>
            <StructuredData data={blogsResponse?.data?.[0]?.seo?.structuredData} />
            <SingleBlogWrapper pageData={blogsResponse?.data[0]} relatedBlogs={blogsResponse?.related} region={region} preview={preview}/>
        </>
    )
}

export default SingleBlog