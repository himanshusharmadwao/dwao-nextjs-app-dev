import StructuredData from "@/components/StructuredData";
import PrivacyPolicyWrapper from "@/components/wrapper/privacy-policy";
import { getRegions } from "@/libs/apis/data/menu";
import { getPolicy } from "@/libs/apis/data/privacyPolicy";
import { checkRegionValidity } from "@/libs/utils";
import NotFound from "@/app/(regional)/[region]/not-found"

// Centralized data fetcher
async function fetchPolicyData(params, searchParams) {
  const preview = searchParams?.preview === "true";
  const region = params?.region ?? "default";

  const regions = await getRegions();
  const validRegion = checkRegionValidity(region, regions);

  if (!validRegion) {
    return { validRegion: false, preview, region, regions, policyResponse: null };
  }

  const policyResponse = await getPolicy(preview, region);
  return { policyResponse, preview, region, regions, validRegion: true };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const { policyResponse, validRegion, region } = await fetchPolicyData(params, searchParams);

  if (!validRegion) {
    return {
      title: "Page Not Found",
      description: "Invalid region specified.",
    };
  }

  if (!policyResponse) {
    return {
      title: "Data Not Found",
      description: "The requested source could not be found.",
    };
  }

  const seo = policyResponse?.data?.seo || {};

  return {
    title: seo?.metaTitle || policyResponse?.data?.title,
    description: seo?.metaDescription || policyResponse?.data?.excerpt,
    keywords: seo?.keywords ? seo?.keywords.split(",").map((k) => k.trim()) : [],
    alternates: {
      canonical:
        seo?.canonicalURL ||
        `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${
          region !== "default" ? `/${region}` : ""
        }/privacy-policy/`,
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

const PrivacyPolicy = async ({ params, searchParams }) => {
  const { policyResponse, validRegion, preview, region } = await fetchPolicyData(params, searchParams);

  if (!validRegion) {
    return <NotFound />;
  }

  const { data, error } = policyResponse;

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
      <PrivacyPolicyWrapper
        policyResponse={data[0]}
        preview={preview}
        region={region}
      />
    </>
  );
};

export default PrivacyPolicy;
