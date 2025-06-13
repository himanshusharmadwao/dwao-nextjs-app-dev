import { getAllBlogs, getCategory } from '@/libs/apis/data/blog';
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

const BlogWrapper = async () => {

    const [categoryResponse, blogsResponse] = await Promise.all([
        getCategory(),
        getAllBlogs()
    ]);

    console.log("categoryResponse: ", categoryResponse, "blogsResponse", blogsResponse)

    return (
        <>
            {/* filter and blog listing */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <BlogPost filterItems={categoryResponse.data} blogPosts={blogsResponse.data} variant="blogPosts" />
            </Suspense>

            <Suspense fallback={<LoadingPlaceholder />}>
                {/* Contact */}
                <ReachOut />
            </Suspense >
        </>
    );
};

export default BlogWrapper;
