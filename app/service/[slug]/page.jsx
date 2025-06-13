import Dv360Service from '@/services/dv360';
import React from 'react';
import { getServiceData } from '@/libs/apis/data/servicePage/dv360';
import NotFound from '@/app/not-found';

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const preview = searchParams.preview ? true : false;
  // console.log(resolvedParams)
  const serviceResponse = await getServiceData(preview, resolvedParams.slug);
  console.log("serviceResponse: ", serviceResponse)
  // const servicePage = serviceResponse.data.find(post => post.slug === resolvedParams.slug);

  if (!serviceResponse) {
    return {
      title: "Not Found",
      description: "The requested source could not be found.",
    };
  }

  const seo = serviceResponse?.data[0]?.seo || {};
  // console.log(serviceResponse?.data[0]?.seo)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const canonicalUrl = `${baseUrl}/service/${serviceResponse?.data[0]?.slug}`;

  return {
    title: seo.metaTitle || serviceResponse?.data[0]?.name,
    description: seo.metaDescription || serviceResponse?.data[0]?.excerpt,
    keywords: seo.keywords ? seo.keywords.split(',').map(keyword => keyword.trim()) : [],
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

const DV360 = async ({ params, searchParams }) => {
  const resolvedParams = await params;
  console.log("params:", resolvedParams);
  const preview = searchParams.preview ? true : false;
  console.log("preview: ", preview)
  const serviceResponse = await getServiceData(preview, resolvedParams.slug);
  console.log("serviceResponse: ", serviceResponse)

  // const servicePage = serviceResponse.data.find(service => service.slug === resolvedParams.slug);

  if (!serviceResponse) {
    return <NotFound />;
  }

  return (
    <>
      <Dv360Service serviceData={serviceResponse.data[0]} />
    </>
  );
};

export default DV360;