import StructuredData from "@/components/StructuredData";
import PrivacyPolicyWrapper from "@/components/wrapper/privacy-policy";
import { getPolicy } from "@/libs/apis/data/privacyPolicy";

// Generate dynamic metadata
export async function generateMetadata({ searchParams }) {
  const preview = searchParams?.preview === "true";
  const policyResponse = await getPolicy(preview);

  if (!policyResponse) {
    return {
      title: "Data Not Found",
      description: "The requested source could not be found.",
    };
  }

  const seo = policyResponse?.data?.seo || {};
  // console.log("Seo: ", seo);

  return {
    title: seo?.metaTitle || policyResponse?.data?.title,
    description: seo?.metaDescription || policyResponse?.data?.excerpt,
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

const PrivacyPolicy = async ({ searchParams }) => {

  const preview = searchParams?.preview === "true";
  const policyResponse = await getPolicy(preview);
  // console.log("preview: ", preview)

  return (
    <>
      <StructuredData data={policyResponse?.data?.seo?.structuredData} />
      <PrivacyPolicyWrapper preview={preview} />
    </>
  );
};

export default PrivacyPolicy;