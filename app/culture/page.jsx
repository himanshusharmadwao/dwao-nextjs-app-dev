import CultureWrapper from "@/components/wrapper/culture"

export const metadata = {
    title: {
        absolute: "Culture at DWAO",
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/culture`,
        },
    }
}

const Culture = async ({ searchParams }) => {

    const resolvedSearchParams  = await searchParams;
    const preview = resolvedSearchParams.preview ? true : false;
    console.log("preview: ", preview)

    return (
        <>
            <CultureWrapper preview={preview} />
        </>
    )
}

export default Culture