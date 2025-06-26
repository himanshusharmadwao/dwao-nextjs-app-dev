import NotFound from "@/app/not-found";
import StructuredData from "@/components/StructuredData";
import SingleBlogWrapper from "@/components/wrapper/insight-single-blog"
import { getInsightBlog } from "@/libs/apis/data/insights";

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
    const { industry, slug } = params;
    const preview = searchParams?.preview === "true";
    const insightBlogsResponse = await getInsightBlog(preview, industry, slug);

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

    const { industry, slug } = params;
    // console.log("Resolved params:", resolvedParams);
    const preview = searchParams?.preview === "true";
    // console.log("preview: ", preview)
    const insightBlogsResponse = await getInsightBlog(preview, industry, slug);
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