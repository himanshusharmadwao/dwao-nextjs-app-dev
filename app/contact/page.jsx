import ContactWrapper from "@/components/wrapper/contact"

export const metadata = {
    title: "Contact",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    },
}

const Contact = () => {
    return (
        <>
            <ContactWrapper />
        </>
    )
}

export default Contact