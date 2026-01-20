import StructuredData from "@/components/StructuredData";
import ReviewWrapper from "@/components/wrapper/marketing-automation-team"
import { getRegions } from "@/libs/apis/data/menu";
import { getReviews } from "@/libs/apis/data/reviews";
import { checkRegionValidity } from "@/libs/utils";
import NotFound from "@/app/(regional)/[region]/not-found"

// Centralized data fetcher
async function fetchReviewData(params, searchParams) {
  const preview = searchParams?.preview === "true";
  const region = params?.region ?? "default";
  const slug = params?.slug;

  const regions = await getRegions();
  const validRegion = checkRegionValidity(region, regions);

  if (!validRegion) {
    return { validRegion: false, preview, region, regions, reviewResponse: null };
  }

  const reviewResponse = await getReviews(preview, slug, region);
  return { reviewResponse, preview, region, regions, validRegion: true };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const { slug } = params;
  const { reviewResponse, validRegion, region } = await fetchReviewData(params, searchParams);

  if (!validRegion) {
    return {
      title: "Page Not Found",
      description: "Invalid region specified.",
    };
  }

  if (!reviewResponse) {
    return {
      title: "Data Not Found",
      description: "The requested source could not be found.",
    };
  }

  const seo = reviewResponse?.data?.seo || {};

  return {
    title: seo?.metaTitle || reviewResponse?.data?.title,
    description: seo?.metaDescription || reviewResponse?.data?.excerpt,
    keywords: seo?.keywords ? seo?.keywords.split(",").map((k) => k.trim()) : [],
    alternates: {
      canonical:
        seo?.canonicalURL ||
        `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${
          region !== "default" ? `/${region}` : ""
        }/reviews/${slug}`,
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

const ReviewMat = async ({ params, searchParams }) => {
  const { reviewResponse, validRegion, preview, region } = await fetchReviewData(params, searchParams);

  if (!validRegion) {
    return <NotFound />;
  }

  const { data, error } = reviewResponse;

  if (error) {
    return (
      <div className="h-screen block">
        <h1 className="text-black lg:text-[54px] text-[32px] font-bold text-center flex justify-center items-center h-full">
          {error}
        </h1>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-screen block">
        <h1 className="text-black lg:text-[54px] text-[32px] font-bold text-center flex justify-center items-center h-full">
          Data Not Found!
        </h1>
      </div>
    );
  }

  return (
    <>
      <StructuredData data={data?.seo?.structuredData} />
      <ReviewWrapper reviewResponse={data[0]} region={region} />
    </>
  );
};

export default ReviewMat;
