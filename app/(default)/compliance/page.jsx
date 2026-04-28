import StructuredData from "@/components/StructuredData";
import ComplianceWrapper from "@/components/wrapper/compliance";
import { getCompliance } from "@/libs/apis/data/compliance";

// Centralized data fetcher
async function fetchComplianceData(searchParamsPromise) {
  const searchParams = await searchParamsPromise;

  const preview = searchParams?.preview === "true";
  const complianceResponse = await getCompliance(preview);

  return { complianceResponse, preview };
}

// Generate dynamic metadata
export async function generateMetadata({ searchParams }) {
  const { complianceResponse } = await fetchComplianceData(searchParams);

  if (!complianceResponse) {
    return {
      title: "Data Not Found",
      description: "The requested source could not be found.",
    };
  }

  const seo = complianceResponse?.data?.[0]?.seo || {};

  return {
    title: seo?.metaTitle || complianceResponse?.data?.[0]?.title,
    description: seo?.metaDescription || complianceResponse?.data?.[0]?.excerpt,
    keywords: seo?.keywords ? seo?.keywords.split(",").map((k) => k.trim()) : [],
    alternates: {
      canonical:
        seo?.canonicalURL ||
        `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}/compliance`,
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

const Compliance = async ({ searchParams }) => {
  const { complianceResponse, preview } = await fetchComplianceData(searchParams);

  const { data, error } = complianceResponse;

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
      <StructuredData data={complianceResponse?.data?.[0]?.seo?.structuredData} />
      <ComplianceWrapper complianceResponse={data[0]} preview={preview} />
    </>
  );
};

export default Compliance;
