import NotFound from "@/app/not-found";
import SingleBlogWrapper from "@/components/wrapper/insight-single-blog"
import { getInsightBlog } from "@/libs/apis/data/insights";

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
    const resolvedParams = await params;
    const preview = searchParams.preview ? true : false;
    const insightBlogsResponse = await getInsightBlog(preview, resolvedParams.slug);

    // const insightBlog = insightBlogsResponse.data.find(post => post.slug === params.slug);

    if (!insightBlogsResponse) {
        return {
            title: "Case Study Not Found",
            description: "The requested case study could not be found.",
        };
    }

    const seo = insightBlogsResponse.data[0].seo || {};
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const canonicalUrl = `${baseUrl}/insights-and-case-studies/${insightBlogsResponse.data[0].slug}`;

    let title = seo.metaTitle || insightBlogsResponse.data[0].title;
    // if (searchParams.preview === true) {
    //     title = `Draft - ${title}`;
    // }

    return {
        title,
        description: seo.metaDescription || "Read the latest insights and case studies.",
        keywords: seo.keywords ? seo.keywords.split(',').map(keyword => keyword.trim()) : [],
        alternates: {
            canonical: canonicalUrl,
        },
    };
}




const SingleBlog = async ({ params, searchParams }) => {

    const resolvedParams = await params;
    // console.log("Resolved params:", resolvedParams);
    const preview = searchParams?.preview ? true : false;
    // console.log("preview: ", preview)
    const insightBlogsResponse = await getInsightBlog(preview, resolvedParams.slug);
    // console.log("insightBlogsResponse: ", insightBlogsResponse)

    // const insightBlog = insightBlogsResponse.data.find(post => post.slug === resolvedParams.slug);

    if (!insightBlogsResponse) {
        return <NotFound />
    }

    return (
        <>
            <SingleBlogWrapper pageData={insightBlogsResponse.data[0]} relatedInsightBlogs={insightBlogsResponse.related} />
        </>
    )

}

export default SingleBlog