import NotFound from "@/app/(regional)/[region]/not-found"
import StructuredData from "@/components/StructuredData";
import SingleBlogWrapper from "@/components/wrapper/single-blog"
import { getBlog } from "@/libs/apis/data/blog";
import { getRegions } from "@/libs/apis/data/menu";
import { checkRegionValidity } from "@/libs/utils";
import { redirect } from "next/navigation";

// Centralized data fetcher
async function fetchBlogData(params, searchParams) {
  const preview = searchParams?.preview === "true";
  const region = params?.region || "default";
  const slug = params?.slug;

  const regions = await getRegions();
  const validRegion = checkRegionValidity(region, regions);

  if (!validRegion) {
    return { validRegion: false, preview, region, slug, blogsResponse: null, regions };
  }

  const blogsResponse = await getBlog(preview, slug, region);
  return { blogsResponse, preview, region, slug, regions, validRegion: true };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const { blogsResponse, validRegion, region, slug } = await fetchBlogData(params, searchParams);

  if (!validRegion) {
    return {
      title: "Page Not Found",
      description: "Invalid region specified.",
    };
  }

  if (!blogsResponse) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const seo = blogsResponse?.data?.[0]?.seo || {};

  return {
    title: seo?.metaTitle || blogsResponse?.data?.[0]?.title,
    description: seo?.metaDescription || blogsResponse?.data?.[0]?.excerpt,
    keywords: seo?.keywords ? seo?.keywords.split(",").map((k) => k.trim()) : [],
    alternates: {
      canonical:
        seo?.canonicalURL ||
        `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${
          region !== "default" ? `/${region}` : ""
        }/blog/${slug}`,
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
          alt: seo?.openGraph?.ogImage?.alternativeText || "DWAO Image",
        },
      ],
      type: seo?.openGraph?.ogType || "website",
    },
  };
}

const SingleBlog = async ({ params, searchParams }) => {
  const { blogsResponse, validRegion, preview } = await fetchBlogData(params, searchParams);

  if (!validRegion) {
    return <NotFound />;
  }

  if (blogsResponse?.status === "error") {
    return <div className="">Something went wrong!! Please try again later.</div>;
  } else if (blogsResponse?.status === "not_found") {
    return redirect("/");
  }

  return (
    <>
      <StructuredData data={blogsResponse?.data?.[0]?.seo?.structuredData} />
      <SingleBlogWrapper
        pageData={blogsResponse?.data[0]}
        relatedBlogs={blogsResponse?.related}
        preview={preview}
      />
    </>
  );
};

export default SingleBlog;
