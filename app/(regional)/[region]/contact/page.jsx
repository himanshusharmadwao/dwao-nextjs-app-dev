import StructuredData from "@/components/StructuredData";
import ContactWrapper from "@/components/wrapper/contact"
import { getContact } from "@/libs/apis/data/contact";
import { getRegions } from "@/libs/apis/data/menu";
import { checkRegionValidity } from "@/libs/utils";
import NotFound from "@/app/(regional)/[region]/not-found"

// Centralized data fetcher
async function fetchContactData(params, searchParams) {
  const preview = searchParams?.preview === "true";
  const region = params?.region ?? "default";

  const regions = await getRegions();
  const validRegion = checkRegionValidity(region, regions);

  if (!validRegion) {
    return { validRegion: false, preview, region, regions, contactResponse: null };
  }

  const contactResponse = await getContact(preview, region);
  return { contactResponse, preview, region, regions, validRegion: true };
}

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
  const { contactResponse, validRegion, region } = await fetchContactData(params, searchParams);

  if (!validRegion) {
    return {
      title: "Page Not Found",
      description: "Invalid region specified.",
    };
  }

  if (!contactResponse) {
    return {
      title: "Data Not Found",
      description: "The requested source could not be found.",
    };
  }

  const seo = contactResponse?.data?.[0]?.seo || {};

  return {
    title: seo?.metaTitle || contactResponse?.data?.[0]?.title,
    description: seo?.metaDescription || contactResponse?.data?.[0]?.excerpt,
    keywords: seo?.keywords ? seo?.keywords.split(",").map((k) => k.trim()) : [],
    alternates: {
      canonical:
        seo?.canonicalURL ||
        `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${
          region !== "default" ? `/${region}` : ""
        }/contact`,
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

const Contact = async ({ params, searchParams }) => {
  const { contactResponse, validRegion, preview, region } = await fetchContactData(params, searchParams);

  if (!validRegion) {
    return <NotFound />;
  }

  const { data, error } = contactResponse;

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
      <StructuredData data={data[0]?.seo?.structuredData} />
      <ContactWrapper data={data[0]} preview={preview} region={region} />
    </>
  );
};

export default Contact;
