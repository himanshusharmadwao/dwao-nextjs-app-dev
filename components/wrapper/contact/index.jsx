import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getContact } from "@/libs/apis/data/contact";

// Dynamic imports with loading placeholders
const CommonBanner = dynamic(() => import("@/components/common/banner"), {
    loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded"></div>,
});

const ReachOut = dynamic(() => import("@/components/common/reachOut"), {
    loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded"></div>,
});

const ToastNotification = dynamic(() => import("@/components/toastNotification"), {
    loading: () => <div className="animate-pulse h-10 w-40 bg-gray-100 rounded"></div>,
});

const ContactForm = dynamic(() => import("@/components/contact"), {
    loading: () => <div className="animate-pulse h-10 w-40 bg-gray-100 rounded"></div>
});

const LoadingPlaceholder = () => (
    <div className="w-full h-40 bg-gray-100 animate-pulse rounded"></div>
);

const ContactWrapper = async ({ preview }) => {

    const contactResponse = await getContact(preview);
    const { data, error } = contactResponse;
    if (error) {
        return (
            <div className='h-screen block'>
                <h1 className='text-black lg:text-[54px] text-[32px] font-bold text-center flex justify-center items-center h-full'>{error}</h1>
            </div>
        )
    }
    if (!data) {
        return (<div className='h-screen block'>
            <h1 className='text-black lg:text-[54px] text-[32px] font-bold text-center flex justify-center items-center h-full'>Data Not Found!</h1>
        </div>)
    }

    const contactData = contactResponse?.data;

    const contactBanner = {
        title: contactData.title,
        deskImage: contactData.bannerDeskImage.url,
        mobileImage: contactData.bannerMobileImage.url,
    };

    return (
        <>
            {/* banner */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <div className="mb-14">
                    <CommonBanner data={contactBanner} />
                </div>
            </Suspense>

            {/* address and form */}
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 mb-14">
                    <div>
                        <h2 className="text-head-large text-con-dark leading-[1] mb-10">
                            {contactData?.officeHeading}
                        </h2>
                        {contactData?.offices?.map((office, index) => (
                            <ul key={index} className="mb-14 w-[300px]">
                                {office?.address && (
                                    <li className="flex gap-4 items-start mb-6">
                                        <Image
                                            src="/icons/location.svg"
                                            height={30}
                                            width={30}
                                            alt="Location Icon"
                                        />
                                        <p className="text-[1.1rem] text-con-dark">{office?.address}</p>
                                    </li>
                                )}
                                {office?.phone && (
                                    <li className="flex gap-4 items-start mb-6">
                                        <Image
                                            src="/icons/call.svg"
                                            height={30}
                                            width={30}
                                            alt="Phone Icon"
                                        />
                                        <Link prefetch={false}
                                            href={`tel:${office.phone}`}
                                            className="text-[1.1rem] text-con-dark"
                                        >
                                            {office?.phone}
                                        </Link>
                                    </li>
                                )}
                                {office?.email && (
                                    <li className="flex gap-4 items-start mb-6">
                                        <Image
                                            src="/icons/envelope.svg"
                                            height={30}
                                            width={30}
                                            alt="Email Icon"
                                        />
                                        <Link prefetch={false}
                                            href={`mailto:${office?.email}`}
                                            className="text-[1.1rem] text-con-dark"
                                        >
                                            {office?.email}
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        ))}
                    </div>
                    <Suspense fallback={<LoadingPlaceholder />}>
                        <div>
                            <ContactForm />
                        </div>
                    </Suspense>
                </div>
            </div>

            {/* map */}
            <div className="container">
                <div className="mb-14">
                    <Image
                        src={contactData?.officeMap?.[0]?.url || "/map.png"}
                        height={600}
                        width={1000}
                        alt="Dwao Office Map"
                        className="w-full max-h-[200px] lg:max-h-none lg:h-auto"
                    />
                </div>
            </div>

            {/* contact */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <ReachOut />
            </Suspense>
            <Suspense fallback={<LoadingPlaceholder />}>
                <ToastNotification />
            </Suspense>
        </>
    );
};

export default ContactWrapper;
