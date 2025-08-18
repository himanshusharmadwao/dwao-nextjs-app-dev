import StructuredData from "@/components/StructuredData";
import AboutWrapper from "@/components/wrapper/about"
import { getAboutData } from "@/libs/apis/data/about";
import { getRegions } from "@/libs/apis/data/menu";
import { checkRegionValidity } from "@/libs/utils";
import NotFound from "@/app/(regional)/[region]/not-found"

// Generate dynamic metadata
export async function generateMetadata({ params, searchParams }) {
    const paramsValue = await searchParams;
    const preview = paramsValue?.preview === "true";
    const region = params?.region ?? "default";

    const regions = await getRegions();
    const validRegion = checkRegionValidity(region, regions);

    if (!validRegion) {
        return {
            title: "Page Not Found",
            description: "Invalid region specified.",
        };
    }

    const aboutResponse = await getAboutData(preview, region);

    if (!aboutResponse) {
        return {
            title: "Data Not Found",
            description: "The requested source could not be found.",
        };
    }

    const seo = aboutResponse?.data[0]?.seo || {};
    // console.log("Seo: ", seo);

    return {
        title: seo?.metaTitle || aboutResponse?.data[0]?.title,
        description: seo?.metaDescription || aboutResponse?.data[0]?.excerpt,
        keywords: seo?.keywords ? seo?.keywords.split(',').map(keyword => keyword.trim()) : [],
        alternates: {
            canonical: seo?.canonicalURL || `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${region !== "default" ? `/${region}` : ""}/about`
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

const About = async ({ params, searchParams }) => {
    const paramsValue = await searchParams;
    const preview = paramsValue?.preview === "true";
    // console.log("preview: ", preview)

    const region = params?.region ?? "default";

    const regions = await getRegions();

    const validRegion = checkRegionValidity(region, regions);
    if (!validRegion) {
        return <NotFound />
    }

    const aboutResponse = await getAboutData(preview, region);

    const { data, error } = aboutResponse;

    if (error) {
        return (
            <div className='h-screen block'>
                <h1 className='text-black lg:text-[54px] text-[32px] font-bold text-center flex justify-center items-center h-full'>{error}</h1>
            </div>
        )
    }
    if (Array.isArray(data) && (!data || data.length <= 0)) {
        return (<div className='h-screen block'>
            <h1 className='text-black lg:text-[54px] text-[32px] font-bold text-center flex justify-center items-center h-full'>Data Not Found!</h1>
        </div>)
    }

    return (
        <>
            <StructuredData data={aboutResponse?.data[0]?.seo?.structuredData} />
            <AboutWrapper data={aboutResponse?.data[0]} regions={regions} preview={preview} region={region} />
        </>
    )
}

export default About