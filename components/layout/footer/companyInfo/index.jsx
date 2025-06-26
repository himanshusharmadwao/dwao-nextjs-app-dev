import { getContact } from "@/libs/apis/data/contact";
import Link from "next/link";

const CompanyInfo = async () => {

    const contactResponse = await getContact();
    const officeResponse = contactResponse?.data;

    // console.log("office: ", officeResponse)

    return (
        <>
            <Link prefetch={false}
                href=""
                className="lg:text-[5.25rem] text-[29px] hover:text-[var(--mainColor)] font-bold lg:leading-[4.25rem] transition-all duration-300"
                style={{ fontFamily: "var(--font-helveticaneuebold)" }}
            >
                DWAO
            </Link>
            <p className="text-con text-[var(--color-con-gray)] lg:mt-10 lg:mb-24 my-5">
                {officeResponse?.offices?.find((item, index) => item.city === "Gurugram") ?.address || "Address not found"}
            </p>
        </>
    );
};

export default CompanyInfo;