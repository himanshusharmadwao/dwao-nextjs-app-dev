import React, { Suspense } from 'react'
import { getAllInsightBlogs, getInsightCategory } from '@/libs/apis/data/insights';
import dynamic from "next/dynamic";

const BlogPost = dynamic(() => import('@/components/blog/blogPost'), {
    loading: () => <div className="animate-pulse h-40 bg-gray-100 rounded"></div>
});

const ReachOut = dynamic(() => import('@/components/common/reachOut'), {
    loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
});

// Loader component for suspense fallback
const LoadingPlaceholder = () => (
    <div className="w-full h-40 bg-gray-100 animate-pulse rounded"></div>
);


const InsightCaseWrapper = async () => {

    // const insightCategoryResponse = await getInsightCategory();
    // console.log(insightCategoryResponse);
    // const insightBlogsResponse = await getInsightBlogs();
    // console.log(insightBlogsResponse);

    const [insightCategoryResponse, insightBlogsResponse] = await Promise.all([
        getInsightCategory(),
        getAllInsightBlogs()
    ]);

    return (
        <>
            {/* filter and blog listing */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <BlogPost filterItems={insightCategoryResponse.data} blogPosts={insightBlogsResponse.data} variant="caseStudies" />
            </Suspense>

            {/* Contact */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <ReachOut />
            </Suspense>
        </>
    )
}

export default InsightCaseWrapper