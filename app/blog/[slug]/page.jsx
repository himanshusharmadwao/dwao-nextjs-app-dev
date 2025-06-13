import NotFound from "@/app/not-found";
import SingleBlogWrapper from "@/components/wrapper/single-blog"
import { getBlog } from "@/libs/apis/data/blog";

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
    const resolvedParams = await params;
    const preview = searchParams.preview ? true : false;
    const blogsResponse = await getBlog(preview, resolvedParams.slug);

    // const blogPost = blogsResponse.data.find(post => post.slug === params.slug);

    if (!blogsResponse) {
        return {
            title: "Blog Not Found",
            description: "The requested blog post could not be found.",
        };
    }

    const seo = blogsResponse.data[0].seo || {};
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const canonicalUrl = `${baseUrl}/blog/${blogsResponse.data[0].slug}`;

    let title = seo.metaTitle || blogsResponse.data[0].title;
    // if (searchParams.preview === true) {
    //     title = `Draft - ${title}`;
    // }


    return {
        title,
        description: seo.metaDescription || blogsResponse.data[0].excerpt,
        keywords: seo.keywords ? seo.keywords.split(',').map(keyword => keyword.trim()) : [],
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

const SingleBlog = async ({ params, searchParams }) => {

    const resolvedParams = await params;
    // console.log("Resolved params:", resolvedParams);
    const preview = searchParams.preview ? true : false;
    // console.log("preview: ", preview)
    const blogsResponse = await getBlog(preview, resolvedParams.slug);
    // console.log("blogsResponse: ", blogsResponse)

    // const blogPost = blogsResponse.data.find(post => post.slug === resolvedParams.slug);

    // console.log("BlogPost: ", blogsResponse)

    if (!blogsResponse) {
        return <NotFound />
    }

    return (
        <>
            <SingleBlogWrapper pageData={blogsResponse.data[0]} relatedBlogs={blogsResponse.related} />
        </>
    )
}

export default SingleBlog