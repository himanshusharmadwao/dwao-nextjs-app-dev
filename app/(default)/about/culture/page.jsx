import StructuredData from "@/components/StructuredData";
import CultureWrapper from "@/components/wrapper/culture"
import { getCulture } from "@/libs/apis/data/culture";
import { getRegions } from "@/libs/apis/data/menu";

// Centralized data fetcher
async function fetchCultureData(searchParams) {
    const preview = searchParams?.preview === "true";
    const [cultureResponse, regions] = await Promise.all([
        getCulture(preview),
        getRegions()
    ]);
    return { cultureResponse, regions, preview };
}

// Generate dynamic metadata
export async function generateMetadata({ searchParams }) {
    const { cultureResponse } = await fetchCultureData(searchParams);

    if (!cultureResponse) {
        return {
            title: "Data Not Found",
            description: "The requested source could not be found.",
        };
    }

    const seo = cultureResponse?.data[0]?.seo || {};
    // console.log("Seo: ", seo);

    return {
        title: seo?.metaTitle || cultureResponse?.data[0]?.title,
        description: seo?.metaDescription || cultureResponse?.data[0]?.excerpt,
        keywords: seo?.keywords ? seo?.keywords.split(',').map(keyword => keyword.trim()) : [],
        alternates: {
            canonical: seo?.canonicalURL ||
                `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}/about/culture/`
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
    const { cultureResponse, regions, preview } = await fetchCultureData(searchParams);

    const { data, error } = cultureResponse;

    if (error) {
        return (
            <div className='h-screen block'>
                <h1 className='text-black lg:text-[54px] text-[32px] font-bold text-center flex justify-center items-center h-full'>{error}</h1>
            </div>
        )
    }
    if (!data) {
        return (
            <div className='h-screen block'>
                <h1 className='text-black lg:text-[54px] text-[32px] font-bold text-center flex justify-center items-center h-full'>
                    Data Not Found!
                </h1>
            </div>
        )
    }

    return (
        <>
            <StructuredData data={cultureResponse?.data[0]?.seo?.structuredData} />
            <CultureWrapper data={cultureResponse?.data[0]} regions={regions} />
        </>
    )
}

export default Culture;
