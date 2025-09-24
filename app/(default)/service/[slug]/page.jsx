import ServicePage from '@/components/service';
import React from 'react';
import { getServiceData } from '@/libs/apis/data/servicePage/dv360';
import NotFound from "@/app/(default)/not-found";
import StructuredData from '@/components/StructuredData';

// Centralized data fetcher
async function fetchServiceData(params, searchParams) {
  const preview = searchParams?.preview === "true";
  const region = params?.region ?? "default";
  const slug = params?.slug;
  const serviceResponse = await getServiceData(preview, slug, region);

  return { serviceResponse, preview, region, slug };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const { serviceResponse } = await fetchServiceData(params, searchParams);

  if (!serviceResponse) {
    return {
      title: "Not Found",
      description: "The requested source could not be found.",
    };
  }

  const seo = serviceResponse?.data?.[0]?.seo || {};

  return {
    title: seo?.metaTitle || serviceResponse?.data?.[0]?.name,
    description: seo?.metaDescription || serviceResponse?.data?.[0]?.excerpt,
    keywords: seo?.keywords ? seo?.keywords.split(",").map((k) => k.trim()) : [],
    alternates: {
      canonical: seo?.canonicalURL,
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

const DV360 = async ({ params, searchParams }) => {
  const { serviceResponse } = await fetchServiceData(params, searchParams);

  const { data, error } = serviceResponse;

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
      <StructuredData data={serviceResponse?.data?.[0]?.seo?.structuredData} />
      <ServicePage serviceData={data[0]} />
    </>
  );
};

export default DV360;
