import InsightCaseWrapper from "@/components/wrapper/insights-and-case-studies";
import { getRegions } from "@/libs/apis/data/menu";
import { checkRegionValidity } from "@/libs/utils";
import NotFound from "@/app/(regional)/[region]/not-found"

export async function generateMetadata({ params }) {
    const region = params?.region ?? "default";

    const regions = await getRegions();
    const validRegion = checkRegionValidity(region, regions);

    if (!validRegion) {
        return {
            title: "Page Not Found",
            description: "Invalid region specified.",
        };
    }

    return {
        title: "Blogs",
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}${region !== "default" ? `/${region}` : ""}/case-studies`
        }
    };
}

const InsightCaseStudies = async ({ params, searchParams }) => {
    const paramsValue = await searchParams;
    const preview = paramsValue?.preview === "true";
    // console.log("preview level 1: ", preview)

    const region = params?.region ?? "default";

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