import { cache } from 'react';
import NotFound from "@/app/(regional)/[region]/not-found";
import StructuredData from "@/components/StructuredData";
import SingleBlogWrapper from "@/components/wrapper/insight-single-blog"
import { getInsightBlog } from "@/libs/apis/data/insights";

// Use edge runtime for faster responses
export const runtime = 'nodejs'; // Keep nodejs for now due to dependencies
export const preferredRegion = 'auto';

// Cache the API call to prevent duplicate requests
const getCachedInsightBlog = cache(async (preview, industry, slug, region) => {
    return await getInsightBlog(preview, industry, slug, region || "default");
});

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
    const { industry, slug, region } = await params;
    const resolvedSearchParams = await searchParams;
    const preview = resolvedSearchParams?.preview === "true";
    const insightBlogsResponse = await getCachedInsightBlog(preview, industry, slug, region || "default");

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
            canonical: seo?.canonicalURL ||
                `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${region !== "default" ? `/${region}` : ""
                }/case-studies/${industry}/${slug}`
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

    const { industry, slug, region } = await params;
    const resolvedSearchParams = await searchParams;
    const preview = resolvedSearchParams?.preview === "true";
    const insightBlogsResponse = await getCachedInsightBlog(preview, industry, slug, region || "default");

    if (!insightBlogsResponse) {
        return <NotFound />
    }



    return (
        <>
            <StructuredData data={insightBlogsResponse?.data?.[0]?.seo?.structuredData} />
            <SingleBlogWrapper pageData={insightBlogsResponse?.data[0]} relatedInsightBlogs={insightBlogsResponse?.related} region={region} />
        </>
    )

}

export default SingleBlog