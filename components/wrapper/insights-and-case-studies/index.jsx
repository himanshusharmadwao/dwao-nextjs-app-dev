import React, { Suspense } from 'react'
import { getInsightCategory, getInsightBlogsListing } from '@/libs/apis/data/insights';
import dynamic from "next/dynamic";
import { getRegions } from '@/libs/apis/data/menu';

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


const InsightCaseWrapper = async ({ preview, region = "default" }) => {

    const insightCategoryResponse = await getInsightCategory(preview, region);

    // Fetch initial case studies data server-side with optimized fields
    const initialCaseStudies = await getInsightBlogsListing(
        1, // page
        6, // pageSize
        null, // category
        null, // subCategory
        preview,
        region
    );

    const regions = await getRegions();

    return (
        <>
            {/* filter and blog listing */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <BlogPost
                    filterItems={insightCategoryResponse?.data}
                    variant="caseStudies"
                    preview={preview}
                    region={region}
                    regions={regions}
                    initialPosts={initialCaseStudies?.data || []}
                    initialMeta={initialCaseStudies?.meta || { pagination: { total: 0 } }}
                />
            </Suspense>

            {/* Contact */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <ReachOut preview={preview} region={region} />
            </Suspense>
        </>
    )
}

export default InsightCaseWrapper