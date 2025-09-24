import { getCategory, getAllBlogs } from '@/libs/apis/data/blog';
import { getRegions } from '@/libs/apis/data/menu';
import dynamicImport from 'next/dynamic';
import { Suspense } from 'react';

const BlogPost = dynamicImport(() => import('@/components/blog/blogPost'), {
    loading: () => <div className="animate-pulse h-40 bg-gray-100 rounded"></div>
});

const ReachOut = dynamicImport(() => import('@/components/common/reachOut'), {
    loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
});

// Loader component for suspense fallback
const LoadingPlaceholder = () => (
    <div className="w-full h-40 bg-gray-100 animate-pulse rounded"></div>
);

const BlogWrapper = async ({preview, region = "default"}) => {

    const categoryResponse = await getCategory(preview, region);

    // Fetch initial blog posts server-side with optimized fields
    const initialBlogs = await getAllBlogs(
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
                    filterItems={categoryResponse?.data}
                    variant="blogPosts"
                    preview={preview}
                    region={region}
                    regions={regions}
                    initialPosts={initialBlogs?.data || []}
                    initialMeta={initialBlogs?.meta || { pagination: { total: 0 } }}
                />
            </Suspense>

            <Suspense fallback={<LoadingPlaceholder />}>
                {/* Contact */}
                <ReachOut preview={preview} region={region}/>
            </Suspense >
        </>
    );
};

export default BlogWrapper;
