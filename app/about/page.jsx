import StructuredData from "@/components/StructuredData";
import AboutWrapper from "@/components/wrapper/about"
import { getAboutData } from "@/libs/apis/data/about";

// Generate dynamic metadata
export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const preview = params?.preview === "true";
    const aboutResponse = await getAboutData(preview);

    if (!aboutResponse) {
        return {
            title: "Data Not Found",
            description: "The requested source could not be found.",
        };
    }

    const seo = aboutResponse?.data?.seo || {};
    // console.log("Seo: ", seo);

    return {
        title: seo?.metaTitle || aboutResponse?.data?.title,
        description: seo?.metaDescription || aboutResponse?.data?.excerpt,
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
        },
        other: seo?.structuredData && typeof seo?.structuredData === 'object'
            ? {
                'script': {
                    type: 'application/ld+json',
                    innerHTML: JSON.stringify(seo?.structuredData),
                },
            }
            : {}
    };
}

const About = async ({ searchParams }) => {
    const params = await searchParams;
    const preview = params?.preview === "true";
    // console.log("preview: ", preview)
    const aboutResponse = await getAboutData(preview);
    return (
        <>
            <StructuredData data={aboutResponse?.data?.seo?.structuredData} />
            <AboutWrapper preview={preview} />
        </>
    )
}

export default About