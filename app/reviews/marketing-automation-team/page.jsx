import ReviewWrapper from "@/components/wrapper/marketing-automation-team"

export const metadata = {
    title: {
        absolute: "DWAO reviews, DWAO Employees Feedback"
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/marketing-automation-team`,
    },
}

const Culture = async ({ searchParams }) => {

    const resolvedSearchParams  = await searchParams;
    const preview = resolvedSearchParams.preview ? true : false;
    console.log("preview: ", preview)

    return (
        <>
            <ReviewWrapper preview={preview} />
        </>
    )
}

export default Culture