import InsightCaseWrapper from "@/components/wrapper/insights-and-case-studies";

export const metadata = {
    title: "Blogs",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/insights-and-case-studies`,
    },
}

const InsightCaseStudies = () => {
    return (
        <>
            <InsightCaseWrapper />
        </>
    );
};

export default InsightCaseStudies;