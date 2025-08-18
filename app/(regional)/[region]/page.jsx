import StructuredData from "@/components/StructuredData";
import HomeWrapper from "@/components/wrapper/home";
import { getHome } from "@/libs/apis/data/home";
import { getRegions } from "@/libs/apis/data/menu";
import { checkRegionValidity } from "@/libs/utils";
import { headers } from "next/headers";
import NotFound from "@/app/(regional)/[region]/not-found"

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const paramsValue = await searchParams;
  const preview = paramsValue?.preview === "true";
  const region = params?.region ?? "default"

  const regions = await getRegions();
  const validRegion = checkRegionValidity(region, regions);

  if (!validRegion) {
    return {
      title: "Page Not Found",
      description: "Invalid region specified.",
    };
  }

  const homeResponse = await getHome(preview, region);

  if (!homeResponse) {
    return {
      title: "Data Not Found",
      description: "The requested source could not be found.",
    };
  }

  const seo = homeResponse?.data[0]?.seo || {};
  // console.log("Seo: ", seo);

  return {
    title: seo?.metaTitle || homeResponse?.data[0]?.title,
    description: seo?.metaDescription || homeResponse?.data[0]?.excerpt,
    keywords: seo?.keywords ? seo?.keywords.split(',').map(keyword => keyword.trim()) : [],
    alternates: {
      canonical: seo?.canonicalURL || `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${region !== "default" ? `/${region}` : ""}`
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
          alt: seo?.openGraph?.ogImage?.alternativeText || 'DWAO Image',
        },
      ],
      type: seo?.openGraph?.ogType || 'website'
    }
  };
}

export default async function Home({ params, searchParams }) {
  const paramsValue = await searchParams;
  const preview = paramsValue?.preview === "true";
  const region = params?.region ?? "default"

  const regions = await getRegions();

  const validRegion = checkRegionValidity(region, regions);
  if (!validRegion) {
    return <NotFound />
  }

  const requestHeaders = await headers();

  const userAgent = requestHeaders.get('user-agent'); //User-Agent contains information about the client's browser and device
  const isMobile = /mobile/i.test(userAgent || ""); //checks if the word "mobile" appears in the userAgent string.

  const homeResponse = await getHome(isMobile ? "mobile" : "desktop", preview, region);

  const { data, error } = homeResponse;

  if (error) {
    return (
      <div className='h-screen block'>
        <h1 className='text-black lg:text-[54px] text-[32px] font-bold text-center flex justify-center items-center h-full'>{error}</h1>
      </div>
    )
  }
  if (Array.isArray(data) && (!data || data.length <= 0)) {
    return (<div className='h-screen block'>
      <h1 className='text-black lg:text-[54px] text-[32px] font-bold text-center flex justify-center items-center h-full'>Data Not Found!</h1>
    </div>)
  }

  return (
    <>
      <StructuredData data={homeResponse?.data[0]?.seo?.structuredData} />
      <HomeWrapper isMobile={isMobile} data={homeResponse?.data[0]} preview={preview} region={region} />
    </>
  );
}
