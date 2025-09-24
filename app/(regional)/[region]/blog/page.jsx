import NotFound from "@/app/(regional)/[region]/not-found"
import BlogWrapper from "@/components/wrapper/blog";
import { getRegions } from "@/libs/apis/data/menu";
import { checkRegionValidity } from "@/libs/utils";

// Centralized data fetcher
async function fetchBlogPageData(params, searchParams) {
  const preview = searchParams?.preview === "true";
  const region = params?.region ?? "default";

  const regions = await getRegions();
  const validRegion = checkRegionValidity(region, regions);

  return { preview, region, validRegion, regions };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const { region, validRegion } = await fetchBlogPageData(params, searchParams);

  if (!validRegion) {
    return {
      title: "Page Not Found",
      description: "Invalid region specified.",
    };
  }

  return {
    title: "Blogs",
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
