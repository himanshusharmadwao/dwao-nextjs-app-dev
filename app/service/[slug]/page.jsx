import Dv360Service from '@/services/dv360';
import React from 'react';
import { getServiceData } from '@/libs/apis/data/servicePage/dv360';
import NotFound from '@/app/not-found';
import StructuredData from '@/components/StructuredData';

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const preview = searchParams?.preview === "true";
  // console.log(resolvedParams)
  const serviceResponse = await getServiceData(preview, resolvedParams.slug);
  // console.log("serviceResponse: ", serviceResponse)
  // const servicePage = serviceResponse.data.find(post => post.slug === resolvedParams.slug);

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
    keywords: seo?.keywords ? seo?.keywords.split(',').map(keyword => keyword.trim()) : [],
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
          alt: seo?.openGraph?.ogImage?.alternativeText || 'DWAO Image',
        },
      ],
      type: seo?.openGraph?.ogType || 'website'
    }
  };
}

const DV360 = async ({ params, searchParams }) => {
  const resolvedParams = await params;
  // console.log("params:", resolvedParams);
  const preview = searchParams?.preview === "true";
  // console.log("preview: ", preview)
  const serviceResponse = await getServiceData(preview, resolvedParams.slug);
  // console.log("serviceResponse: ", serviceResponse)

  // const servicePage = serviceResponse.data.find(service => service.slug === resolvedParams.slug);

  if (serviceResponse.data.length <= 0) {
    return <NotFound />;
  }

  return (
    <>
      <StructuredData data={serviceResponse?.data?.[0]?.seo?.structuredData} />
      <Dv360Service serviceData={serviceResponse.data[0]} />
    </>
  );
};

export default DV360;