import React from 'react';
import qs from 'qs';
import NotFound from "@/app/not-found.jsx";
import SinglePageWrapper from '@/components/wrapper/single-page';
import { getPartner } from '@/libs/apis/data/partners';
import StructuredData from '@/components/StructuredData';
import { getRegions } from '@/libs/apis/data/menu';

// Centralized data fetcher
async function fetchPartnersData(params, searchParams) {
  const preview = searchParams?.preview === "true";
  const region = params?.region ?? "default";

  const capabilityResponse = await getPartner(preview, "partners", region);
  const regions = await getRegions();

  return { capabilityResponse, preview, region, regions };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  try {
    const { capabilityResponse } = await fetchPartnersData(params, searchParams);

    if (!capabilityResponse) {
      return {
        title: "Blog Not Found",
        description: "The requested capability blog post could not be found.",
      };
    }

    const seo = capabilityResponse?.data?.[0]?.seo || {};

    return {
      title: seo?.metaTitle || capabilityResponse?.data?.[0]?.title,
      description: seo?.metaDescription || "Explore our capabilities and expertise.",
      ...(seo?.keywords && {
        keywords: seo?.keywords.split(",").map((keyword) => keyword.trim()),
      }),
      alternates: {
        canonical:
          seo?.canonicalURL ||
          `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}/partners`,
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
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading the blog post.",
    };
  }
}

const DynamicPages = async ({ params, searchParams }) => {
  const { capabilityResponse, preview, regions } = await fetchPartnersData(
    params,
    searchParams
  );

  if (capabilityResponse?.data == null) {
    return <NotFound />;
  }

  return (
    <>
      <StructuredData data={capabilityResponse?.data?.[0]?.seo?.structuredData} />
      <SinglePageWrapper
        pageData={capabilityResponse?.data[0]}
        relatedCapabilities={capabilityResponse?.related}
        regions={regions}
        type="partners"
      />
    </>
  );
};

export default DynamicPages;
