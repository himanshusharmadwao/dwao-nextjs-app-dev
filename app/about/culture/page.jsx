import StructuredData from "@/components/StructuredData";
import CultureWrapper from "@/components/wrapper/culture"
import { getCulture } from "@/libs/apis/data/culture";

// Generate dynamic metadata
export async function generateMetadata({ searchParams }) {
    const preview = searchParams?.preview === "true";
    console.log("preview: ", preview)
    const cultureResponse = await getCulture(preview);

    if (!cultureResponse) {
        return {
            title: "Data Not Found",
            description: "The requested source could not be found.",
        };
    }

    const seo = cultureResponse?.data?.seo || {};
    // console.log("Seo: ", seo);

    return {
        title: seo?.metaTitle || cultureResponse?.data?.title,
        description: seo?.metaDescription || cultureResponse?.data?.excerpt,
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

const Culture = async ({ searchParams }) => {

    const preview = searchParams?.preview === "true";
    // console.log("preview: ", preview)
    const cultureResponse = await getCulture(preview);

    return (
        <>
            <StructuredData data={cultureResponse?.data?.seo?.structuredData} />
            <CultureWrapper preview={preview} />
        </>
    )
}

export default Culture