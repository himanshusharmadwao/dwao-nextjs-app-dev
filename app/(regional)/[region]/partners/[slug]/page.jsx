import React from "react";
import qs from "qs";
import NotFound from "@/app/(regional)/[region]/not-found";
import SinglePageWrapper from "@/components/wrapper/single-page";
import { getPartner } from "@/libs/apis/data/partners";
import StructuredData from "@/components/StructuredData";
import { getRegions } from "@/libs/apis/data/menu";
import { checkRegionValidity } from "@/libs/utils";

// Centralized data fetcher
async function fetchPartnerData(params, searchParams) {
  const preview = searchParams?.preview === "true";
  const region = params?.region ?? "default";
  const slug = params?.slug;

  const regions = await getRegions();
  const validRegion = checkRegionValidity(region, regions);

  if (!validRegion) {
    return { validRegion: false, preview, region, slug, regions, capabilityResponse: null };
  }

  const capabilityResponse = await getPartner(preview, slug, region);
  return { capabilityResponse, preview, region, slug, regions, validRegion: true };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  try {
    const { capabilityResponse, validRegion, region, slug } = await fetchPartnerData(params, searchParams);

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
      ...(seo?.keywords && {
        keywords: seo?.keywords.split(",").map((keyword) => keyword.trim()),
      }),
      alternates: {
        canonical:
          seo?.canonicalURL ||
          `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${
            region !== "default" ? `/${region}` : ""
          }/partners/${slug}`,
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
  // Example placeholder logic; kept commented out as in original
};

const DynamicPages = async ({ params, searchParams }) => {
  const { capabilityResponse, validRegion, preview, region, regions } = await fetchPartnerData(params, searchParams);

  if (!validRegion) {
    return <NotFound />;
  }

  if (capabilityResponse?.data == null) {
    return <NotFound />;
  }

  return (
    <>
      <StructuredData data={capabilityResponse?.data?.[0]?.seo?.structuredData} />
      <SinglePageWrapper
        pageData={capabilityResponse.data[0]}
        relatedCapabilities={capabilityResponse.related}
        regions={regions}
        region={region}
        type="partners"
      />
    </>
  );
};

export default DynamicPages;
