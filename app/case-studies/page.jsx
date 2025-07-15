import InsightCaseWrapper from "@/components/wrapper/insights-and-case-studies";

export const metadata = {
    title: "Blogs",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/insights-and-case-studies`,
    },
}

const InsightCaseStudies = async ({ searchParams }) => {
    const params = await searchParams;
    const preview = params?.preview === "true";
    // console.log("preview level 1: ", preview)
    return (
        <>
            <InsightCaseWrapper preview={preview} />
        </>
    );
};

export default InsightCaseStudies;