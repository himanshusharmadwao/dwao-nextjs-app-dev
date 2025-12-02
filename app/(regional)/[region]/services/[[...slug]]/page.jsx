import React from 'react';
import qs from 'qs';
import SinglePageWrapper from '@/components/wrapper/single-page';
import { getCapability } from '@/libs/apis/data/capabilities';
import StructuredData from '@/components/StructuredData';
import { getRegions } from '@/libs/apis/data/menu';
import NotFound from '@/app/(regional)/[region]/not-found';
import { checkRegionValidity } from '@/libs/utils';

// Centralized data fetcher
async function fetchCapabilityDataPage(params, searchParams) {
  const region = params?.region ?? "default";
  const slug1 = params?.slug?.[0];
  const slug2 = params?.slug?.[1];
  const preview = searchParams?.preview === "true";

  const regions = await getRegions();
  const validRegion = checkRegionValidity(region, regions);

  if(slug1 === slug2) return <NotFound />; 

  if (!validRegion) {
    return { validRegion: false, preview, region, regions, capabilityResponse: null, slug1, slug2 };
  }

  const capabilityResponse = await getCapability(preview, slug1, slug2, region);
  return { capabilityResponse, preview, region, regions, validRegion: true, slug1, slug2 };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const { capabilityResponse, validRegion, region, slug1, slug2 } = await fetchCapabilityDataPage(params, searchParams);

  if (!validRegion) {
    return {
      title: "Page Not Found",
      description: "Invalid region specified.",
    };
  }

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
    ...(seo?.keywords && { keywords: seo?.keywords.split(',').map(k => k.trim()) }),
    alternates: {
      canonical: seo?.canonicalURL ||
        `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${
          region !== "default" ? `/${region}` : ""
        }/services/${slug1}${slug2 ? `/${slug2}` : ""}/`,
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
      type: seo?.openGraph?.ogType || 'website',
    },
  };
}

// Optional loader for future static pages (kept intact)
export const loadPage = async (slug) => {
  const query = qs.stringify({
    filters: {
      slug: { $contains: slug }
    },
    populate: {
      Header: { populate: "*" }
    }
  }, { encode: false });

  // Placeholder for future static API fetch usage
};

// Page component
const DynamicPages = async ({ params, searchParams }) => {
  const { capabilityResponse, validRegion, regions } = await fetchCapabilityDataPage(params, searchParams);

  if (!validRegion) return <NotFound />;

  if (capabilityResponse?.data == null) {
    return <NotFound />;
  }

  if (capabilityResponse.status === "error") {
    return <div className="">Something went wrong!! Please try again later.</div>;
  } else if (capabilityResponse.status === "not_found") {
    return redirect('/');
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
