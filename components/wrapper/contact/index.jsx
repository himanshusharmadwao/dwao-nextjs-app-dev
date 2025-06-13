import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getOfficeMap, getOffices } from "@/libs/apis/data/contact";

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

const ContactWrapper = async () => {
    const contactBanner = {
        title: "Reach out to Us",
        deskImage: "/contact-us.jpg",
        mobileImage: "/contact-us-mobile.jpg",
    };

    const officesResponse = await getOffices();
    const offices = officesResponse.data;

    const officeMapResponse = await getOfficeMap();
    const officeMap = officeMapResponse.data[0].image.url;

    return (
        <>
            {/* banner */}
            <div className="mb-14">
                <CommonBanner data={contactBanner} />
            </div>

            {/* address and form */}
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 mb-14">
                    <div>
                        <h2 className="text-head-large text-con-dark leading-[1] mb-10">
                            Visit our offices
                        </h2>
                        {offices.map((office, index) => (
                            <ul key={index} className="mb-14 w-[300px]">
                                {office.address && (
                                    <li className="flex gap-4 items-start mb-6">
                                        <Image
                                            src="/icons/location.svg"
                                            height={30}
                                            width={30}
                                            alt="Location Icon"
                                        />
                                        <p className="text-[1.1rem] text-con-dark">{office.address}</p>
                                    </li>
                                )}
                                {office.phone && (
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
                                            {office.phone}
                                        </Link>
                                    </li>
                                )}
                                {office.email && (
                                    <li className="flex gap-4 items-start mb-6">
                                        <Image
                                            src="/icons/envelope.svg"
                                            height={30}
                                            width={30}
                                            alt="Email Icon"
                                        />
                                        <Link prefetch={false} 
                                            href={`mailto:${office.email}`}
                                            className="text-[1.1rem] text-con-dark"
                                        >
                                            {office.email}
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        ))}
                    </div>

                    <div>
                        <ContactForm />
                    </div>
                </div>
            </div>

            {/* map */}
            <div className="container">
                <div className="mb-14">
                    <Image
                        src={officeMap || "/map.png"}
                        height={600}
                        width={1000}
                        alt="Dwao Office Map"
                        className="w-full max-h-[200px] lg:max-h-none lg:h-auto"
                    />
                </div>
            </div>

            {/* contact */}
            <ReachOut />
            <ToastNotification />
        </>
    );
};

export default ContactWrapper;
