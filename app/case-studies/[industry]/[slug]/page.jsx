import { cache } from 'react';
import NotFound from "@/app/not-found";
import StructuredData from "@/components/StructuredData";
import SingleBlogWrapper from "@/components/wrapper/insight-single-blog"
import { getInsightBlog } from "@/libs/apis/data/insights";

// Use edge runtime for faster responses
export const runtime = 'nodejs'; // Keep nodejs for now due to dependencies
export const preferredRegion = 'auto';

// Cache the API call to prevent duplicate requests
const getCachedInsightBlog = cache(async (preview, industry, slug) => {
  return await getInsightBlog(preview, industry, slug);
});

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
    const { industry, slug } = await params;
    const resolvedSearchParams = await searchParams;
    const preview = resolvedSearchParams?.preview === "true";
    const insightBlogsResponse = await getCachedInsightBlog(preview, industry, slug);

    // const insightBlog = insightBlogsResponse.data.find(post => post.slug === params.slug);

    if (!insightBlogsResponse) {
        return {
            title: "Case Study Not Found",
            description: "The requested case study could not be found.",
        };
    }

    const seo = insightBlogsResponse?.data?.[0]?.seo || {};

    // console.log("seo: ", seo)

    return {
        title: seo?.metaTitle || insightBlogsResponse?.data?.[0]?.title,
        description: seo?.metaDescription || "Read the latest insights and case studies.",
        keywords: seo?.keywords ? seo?.keywords.split(',').map(keyword => keyword.trim()) : [],
        alternates: {
            canonical: seo?.canonicalURL,
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

    const { industry, slug } = await params;
    // console.log("params:", industry, slug);
    const resolvedSearchParams = await searchParams;
    const preview = resolvedSearchParams?.preview === "true";
    // console.log("preview: ", preview)
    const insightBlogsResponse = await getCachedInsightBlog(preview, industry, slug);
    // console.log("insightBlogsResponse: ", insightBlogsResponse)

    // const insightBlog = insightBlogsResponse.data.find(post => post.slug === resolvedParams.slug);

    if (!insightBlogsResponse) {
        return <NotFound />
    }

    return (
        <>
            <StructuredData data={insightBlogsResponse?.data?.[0]?.seo?.structuredData} />
            <SingleBlogWrapper pageData={insightBlogsResponse.data[0]} relatedInsightBlogs={insightBlogsResponse.related} />
        </>
    )

}

export default SingleBlog