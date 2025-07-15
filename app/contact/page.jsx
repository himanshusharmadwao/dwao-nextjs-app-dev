import StructuredData from "@/components/StructuredData";
import ContactWrapper from "@/components/wrapper/contact"
import { getContact } from "@/libs/apis/data/contact";

// Generate dynamic metadata
export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const preview = params?.preview === "true";
    const contactResponse = await getContact(preview);

    if (!contactResponse) {
        return {
            title: "Data Not Found",
            description: "The requested source could not be found.",
        };
    }

    const seo = contactResponse?.data?.seo || {};
    // console.log("Seo: ", seo);

    return {
        title: seo?.metaTitle || contactResponse?.data?.title,
        description: seo?.metaDescription || contactResponse?.data?.excerpt,
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

const Contact = async ({ searchParams }) => {
    const params = await searchParams;
    const preview = params?.preview === "true";
    // console.log("preview: ", preview)

    const contactResponse = await getContact(preview);

    return (
        <>
            <StructuredData data={contactResponse?.data?.seo?.structuredData} />
            <ContactWrapper preview={preview} />
        </>
    )
}

export default Contact