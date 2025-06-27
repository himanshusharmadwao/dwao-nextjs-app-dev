import StructuredData from "@/components/StructuredData";
import HomeWrapper from "@/components/wrapper/home";
import { getHome } from "@/libs/apis/data/home";

// Generate dynamic metadata
export async function generateMetadata({ searchParams }) {
  const preview = searchParams?.preview === "true";
  const homeResponse = await getHome(preview);

  if (!homeResponse) {
    return {
      title: "Data Not Found",
      description: "The requested source could not be found.",
    };
  }

  const seo = homeResponse?.data?.seo || {};
  // console.log("Seo: ", seo);

  return {
    title: seo?.metaTitle || homeResponse?.data?.title,
    description: seo?.metaDescription || homeResponse?.data?.excerpt,
    keywords: seo?.keywords ? seo?.keywords.split(',').map(keyword => keyword.trim()) : [],
    alternates: {
      canonical: seo?.canonicalURL || '/'
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

export default async function Home({ searchParams }) {

  const preview = searchParams?.preview === "true";
  // console.log("preview: ", preview)
  const homeResponse = await getHome(preview);

  return (
    <>
      <StructuredData data={homeResponse?.data?.seo?.structuredData} />
      <HomeWrapper preview={preview} />
    </>
  );
}
