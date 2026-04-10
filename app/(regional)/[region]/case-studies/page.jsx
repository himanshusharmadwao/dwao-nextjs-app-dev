import InsightCaseWrapper from "@/components/wrapper/insights-and-case-studies";
import { getRegions } from "@/libs/apis/data/menu";
import { checkRegionValidity, appendRegionToTitle, prependRegionToDescription } from "@/libs/utils";
import NotFound from "@/app/(regional)/[region]/not-found"

export async function generateMetadata({ params }) {
  const paramsData = await params;
    const region = paramsData?.region ?? "default";

    const regions = await getRegions();
    const validRegion = checkRegionValidity(region, regions);

    if (!validRegion) {
        return {
            title: "Page Not Found",
            description: "Invalid region specified.",
        };
    }

    return {
        title: appendRegionToTitle("Blogs", region, regions),
        description: prependRegionToDescription("DWAO offers digital transformation and marketing services, including analytics, CRO, performance marketing, CDP, marketing automation, SEO, and more, helping businesses enhance their online presence, optimize performance, and drive growth.", region, regions),
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${region !== "default" ? `/${region}` : ""}/case-studies`
        }
    };
}

const InsightCaseStudies = async ({ params, searchParams }) => {
    const paramsValue = await searchParams;
    const paramsData = await params;
    const preview = paramsValue?.preview === "true";
    // console.log("preview level 1: ", preview)

    const region = paramsData?.region ?? "default";

    const regions = await getRegions();

    const validRegion = checkRegionValidity(region, regions);
    if (!validRegion) {
        return <NotFound />
    }

    return (
        <>
            <InsightCaseWrapper preview={preview} region={region} />
        </>
    );
};

export default InsightCaseStudies;