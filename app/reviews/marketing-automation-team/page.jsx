import StructuredData from "@/components/StructuredData";
import ReviewWrapper from "@/components/wrapper/marketing-automation-team"
import { getReviews } from "@/libs/apis/data/reviews";

// Generate dynamic metadata
export async function generateMetadata({ searchParams }) {
    const preview = searchParams?.preview === "true";
    const reviewResponse = await getReviews(preview);

    if (!reviewResponse) {
        return {
            title: "Data Not Found",
            description: "The requested source could not be found.",
        };
    }

    console.log(reviewResponse)

    const seo = reviewResponse?.data?.seo || {};
    console.log("Seo: ", seo);

    return {
        title: seo?.metaTitle || reviewResponse?.data?.title,
        description: seo?.metaDescription || reviewResponse?.data?.excerpt,
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

    const reviewResponse = await getReviews(preview);

    return (
        <>
            <StructuredData data={reviewResponse?.data?.seo?.structuredData} />
            <ReviewWrapper preview={preview} />
        </>
    )
}

export default Culture