import NotFound from "@/app/(regional)/[region]/not-found"
import BlogWrapper from "@/components/wrapper/blog";
import { getRegions } from "@/libs/apis/data/menu";
import { checkRegionValidity, appendRegionToTitle, prependRegionToDescription } from "@/libs/utils";

// Centralized data fetcher
async function fetchBlogPageData(params, searchParams) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const preview = resolvedSearchParams?.preview === "true";
  const region = resolvedParams?.region ?? "default";

  const regions = await getRegions();
  const validRegion = checkRegionValidity(region, regions);

  return { preview, region, validRegion, regions };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  
  const { region, validRegion, regions } = await fetchBlogPageData(params, searchParams);

  if (!validRegion) {
    return {
      title: "Page Not Found",
      description: "Invalid region specified.",
    };
  }

  return {
    title: appendRegionToTitle("Blogs", region, regions),
    description: prependRegionToDescription("DWAO offers digital transformation and marketing services, including analytics, CRO, performance marketing, CDP, marketing automation, SEO, and more, helping businesses enhance their online presence, optimize performance, and drive growth.", region, regions),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${
        region !== "default" ? `/${region}` : ""
      }/blog`,
    },
  };
}

const Blog = async ({ params, searchParams }) => {
  const { preview, region, validRegion } = await fetchBlogPageData(
    params,
    searchParams
  );

  if (!validRegion) {
    return <NotFound />;
  }

  return (
    <>
      <BlogWrapper preview={preview} region={region} />
    </>
  );
};

export default Blog;
