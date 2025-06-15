import AboutWrapper from "@/components/wrapper/about"

export const metadata = {
    title: "About",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
    },
}

const About = async ({searchParams}) => {

    const preview = searchParams.preview === "true";
    // console.log("preview: ", preview)

    return (
        <>
            <AboutWrapper preview={preview}/>
        </>
    )
}

export default About