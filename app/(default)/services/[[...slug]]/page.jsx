import React from 'react';
import qs from 'qs';
// import { notFound, redirect } from 'next/navigation';
import NotFound from '@/app/(default)/not-found';
import SinglePageWrapper from '@/components/wrapper/single-page';
import { getCapability } from '@/libs/apis/data/capabilities';
import StructuredData from '@/components/StructuredData';
import { getRegions } from '@/libs/apis/data/menu';

// Centralized data fetcher
async function fetchCapabilityData(params, searchParams) {
  const preview = searchParams?.preview === "true";
  const [slug1, slug2] = params?.slug || [];
  if(slug1 === slug2) return <NotFound />; 
  const capabilityResponse = await getCapability(preview, slug1, slug2);
  const regions = await getRegions();

  return { capabilityResponse, preview, slug1, slug2, regions };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const { capabilityResponse, slug1, slug2 } = await fetchCapabilityData(params, searchParams);

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
        `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}/services/${slug1}${
          slug2 ? `/${slug2}` : ""
        }/`,
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

export const loadPage = async (slug) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $contains: slug,
        },
      },
      populate: {
        Header: {
          populate: "*", // Populate all components inside the dynamic zone
        },
      },
    },
    { encode: false }
  );

  // console.log(query, "query");
  // API fetch logic commented out here
};

const DynamicPages = async ({ params, searchParams }) => {
  const { capabilityResponse, regions } = await fetchCapabilityData(params, searchParams);

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
        type="services"
      />
    </>
  );
};

export default DynamicPages;
