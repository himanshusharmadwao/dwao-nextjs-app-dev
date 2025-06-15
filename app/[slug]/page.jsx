import React from 'react';
import qs from 'qs';
// import { notFound, redirect } from 'next/navigation';
import NotFound from '@/app/not-found';
import SinglePageWrapper from '@/components/wrapper/single-page';
import { getCapability } from '@/libs/apis/data/capaibilities';
 
export async function generateMetadata({ params, searchParams }) {
  try {
    const resolvedParams = await params;
    const preview = searchParams.preview ? true : false;
    const capabilityResponse = await getCapability(preview ,resolvedParams.slug);

    // const currentPost = capabilityResponse.data.find(post => post.slug === params?.slug);

    if (!capabilityResponse) {
      return {
        title: "Blog Not Found",
        description: "The requested capability blog post could not be found.",
      };
    }

    const seo = capabilityResponse.data[0].seo || {};
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const canonicalUrl = `${baseUrl}/${capabilityResponse.data[0].slug}`;

    let title = seo.metaTitle || capabilityResponse.data[0].title;
    // if (searchParams.preview === true) {
    //     title = `Draft - ${title}`;
    // }

    // console.log("metaDescription: ", seo.metaDescription )

    return {
      title,
      description: seo.metaDescription || "Explore our capabilities and expertise.",
      ...(seo.keywords && {
        keywords: seo.keywords.split(',').map(keyword => keyword.trim()),
      }),
      alternates: {
        canonical: canonicalUrl,
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
  const query = qs.stringify({
    filters: {
      slug: {
        $contains: slug
      }
    },
    populate: {
      Header: {
        populate: "*" // Populate all components inside the dynamic zone
      }
    }
  }, { encode: false });

  console.log(query, "query");

  // try {
  //   const getPageApi = await fetch(`http://localhost:1337/api/pages?${query}`);

  //   if (!getPageApi.ok) {
  //     console.error(`API responded with status: ${getPageApi.status}`);
  //     return null;
  //   }

  //   const page = await getPageApi.json();

  //   if (!page.data || page.data.length === 0) {
  //     return null;
  //   }

  //   return page;
  // } catch (error) {
  //   console.error("Error fetching page data:", error);
  //   return null;
  // }
};

const DynamicPages = async ({ params, searchParams }) => {
  const resolvedParams = await params;
  console.log("resolved params", resolvedParams);
  const preview = searchParams.preview === "true"; //exact comparison because of js non-empty string logic
  // console.log("preview: ", preview)
  const capabilityResponse = await getCapability(preview, resolvedParams.slug);
  console.log("capabilityResponse: ", capabilityResponse)
  // const capabilityPost = capabilityResponse.data.find(post => post.slug === resolvedParams?.slug);
  // console.log("capability post: ",capabilityPost)
  if (!capabilityResponse) {
    return <NotFound />
  }

  return (
    <>
      <SinglePageWrapper pageData={capabilityResponse.data[0]} relatedCapabilities={capabilityResponse.related} />
    </>
  );
};

export default DynamicPages;
