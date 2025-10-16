import StructuredData from "@/components/StructuredData";
import HomeWrapper from "@/components/wrapper/home";
import { getHome } from "@/libs/apis/data/home";
import { getRegions } from "@/libs/apis/data/menu";
import { checkRegionValidity } from "@/libs/utils";
import { headers } from "next/headers";
import NotFound from "@/app/(regional)/[region]/not-found";

// Centralized data fetcher
async function fetchHomeData(params, searchParams) {
  const preview = searchParams?.preview === "true";
  const region = params?.region ?? "default";

  // Validate region
  const regions = await getRegions();
  const validRegion = checkRegionValidity(region, regions);
  if (!validRegion) {
    return { error: "Invalid region specified", validRegion: false };
  }

  // Detect device type from user-agent
  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent);

  // Fetch data
  const homeResponse = await getHome(isMobile ? "mobile" : "desktop", preview, region);

  return { homeResponse, isMobile, preview, region, validRegion: true };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const { homeResponse, validRegion } = await fetchHomeData(params, searchParams);

  if (!validRegion) {
    return {
      title: "Page Not Found",
      description: "Invalid region specified.",
    };
  }

  if (!homeResponse) {
    return {
      title: "Data Not Found",
      description: "The requested source could not be found.",
    };
  }

  const seo = homeResponse?.data?.[0]?.seo || {};

  return {
    title: seo?.metaTitle || homeResponse?.data?.[0]?.title,
    description: seo?.metaDescription || homeResponse?.data?.[0]?.excerpt,
    keywords: seo?.keywords ? seo?.keywords.split(",").map((k) => k.trim()) : [],
    alternates: {
      canonical:
        seo?.canonicalURL ||
        `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${params?.region && params.region !== "default" ? `/${params.region}` : ""
        }`,
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
    other: {
      "google-site-verification": "d4Ng9NKlUx8bd3h0ukTyQwWgZu8uT6UOSQFYpimQSV4",
    },
  };
}

export default async function Home({ params, searchParams }) {
  const { homeResponse, isMobile, preview, region, validRegion, error } =
    await fetchHomeData(params, searchParams);

  if (!validRegion) {
    return <NotFound />;
  }

  const { data } = homeResponse || {};

  if (error || homeResponse?.error) {
    return (
      <div className="h-screen block">
        <h1 className="text-black lg:text-[54px] text-[32px] font-bold text-center flex justify-center items-center h-full">
          {error || homeResponse.error}
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
      <StructuredData data={data[0]?.seo?.structuredData} />
      <HomeWrapper isMobile={isMobile} data={data[0]} preview={preview} region={region} />
    </>
  );
}
