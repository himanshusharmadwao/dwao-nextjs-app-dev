import React, { Suspense } from 'react'
import Banner from "@/components/home/banner";
import { getClients, getClientTestimonials, getHome } from '@/libs/apis/data/home';
import { getImageUrl } from '@/libs/utils';
import { getAllInsightBlogs } from '@/libs/apis/data/insights';
import dynamic from 'next/dynamic'
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';

// Dynamically import components with correct settings for Server Components
const ClientCarousel = dynamic(() => import("@/components/common/clientCarousel"), {
    loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
});

const JoinTheTeam = dynamic(() => import("@/components/common/joinTheTeam"), {
    loading: () => <div className="animate-pulse h-40 bg-gray-100 rounded"></div>
});

const StudyCard = dynamic(() => import("@/components/home/studyCard"));

const StudyCarousel = dynamic(() => import("@/components/home/studyCarousel"), {
    loading: () => <div className="animate-pulse h-60 bg-gray-100 rounded"></div>
});

const TestimonialCard = dynamic(() => import("@/components/home/testimonialCard"));

const TestimonialCarousel = dynamic(() => import("@/components/home/testimonialCarousel"), {
    loading: () => <div className="animate-pulse h-60 bg-gray-100 rounded"></div>
});

const ExtendLink = dynamic(() => import("@/components/ui/extendLink"));
const LinkBtn = dynamic(() => import("@/components/ui/link"));

// For ReachOut component, we'll create a client component wrapper
const ReachOut = dynamic(() => import('@/components/reachOut').then(mod => mod.Reachout));

// Loader component for suspense fallback
const LoadingPlaceholder = () => (
    <div className="w-full h-40 bg-gray-100 animate-pulse rounded"></div>
);

const HomeWrapper = async ({ preview }) => {

    const requestHeaders = await headers();

    // ============================ headers() returns a special iterable object, so we have to convert this into iterable object

    // const headersObj = {};
    // for (const [key, value] of requestHeaders.entries()) {
    //     headersObj[key] = value;
    // }
    // console.log("Request Headers:", headersObj);

    // ============================

    const userAgent = requestHeaders.get('user-agent'); //User-Agent contains information about the client's browser and device
    const isMobile = /mobile/i.test(userAgent || ""); //checks if the word "mobile" appears in the userAgent string.

    // Fetch critical data for initial render
    const homeResponse = await getHome(isMobile ? "mobile" : "desktop", preview);
    const { data, error } = homeResponse;
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

    // Fetch remaining data in parallel
    const [
        clientsResponse,
        clientTestimonialResponse,
        insightBlogsResponse,
    ] = await Promise.all([
        getClients(),
        getClientTestimonials(),
        getAllInsightBlogs(),
    ]);

    // console.log(clientTestimonialResponse)

    // Prepare data for components that will be rendered later
    const studySlides = insightBlogsResponse?.data?.map((card, index) => (
            <StudyCard
                key={index}
                imageSrc={getImageUrl(card.thumbnail)}
                title={card.title}
                description={card.insightStatus}
                href={`/case-studies/${card?.stats?.industry?.toLowerCase().replace(/\s+/g, '-')}/${card?.slug}`}
            />
    ));

    // console.log("insightBlogsResponse: ",insightBlogsResponse)

    const testimonialSlides = clientTestimonialResponse?.data?.map((testimonial, index) => (
        <TestimonialCard
            key={index}
            rating={testimonial.rating}
            quote={testimonial.quote}
            name={testimonial.name}
            title={testimonial.title}
            imageSrc={getImageUrl(testimonial.icon)}
        />
    ));

    // console.log(clientsResponse.data)

    const clientSlide = clientsResponse.data.filter((item, index) => {
        return item.service === "main"
    })

    return (
        <>
            {/* Critical first render component */}
            <div className="mb-14">
                <Banner data={homeResponse?.data?.banner} isMobile={isMobile} />
            </div>

            <Suspense fallback={<LoadingPlaceholder />}>
                {/* success story */}
                <div className="container" id="clientStory">
                    <div className="mb-14">
                        <h2 className="text-start lg:text-center text-head text-con-dark mb-12">{homeResponse?.data?.storyHeading}</h2>
                        <div className="flex flex-col lg:flex-row items-center lg:gap-[10px]">
                            <div className="basis-full lg:basis-[65%]">
                                <h3 className="text-con-dark text-[20px] lg:text-[25px] leading-[40px] mb-6">"{homeResponse?.data?.storyQuote}"</h3>
                                <div className="text-[25px] text-con-dark"><span className="font-bold">{homeResponse?.data?.storyName},</span>{homeResponse?.data?.storyDesignition}</div>
                            </div>
                            <div className="relative basis-full lg:basis-[35%] mt-10 lg:mt-0">
                                <div className="relative lg:order-2 order-1 basis-full md:basis-[calc((100%-60px)/3)]">
                                    <Link prefetch={false} href={homeResponse?.data?.storyOverlay?.href || '#'} className="relative group w-full lg:inline inline-block">
                                        {homeResponse?.data?.storyOverlay?.image?.url && (
                                            <Image
                                                src={homeResponse?.data?.storyOverlay?.image?.url}
                                                alt="Card Image"
                                                width={394}
                                                height={293}
                                                priority={false}
                                                className="w-full h-auto object-cover rounded-[10px]"
                                            />
                                        )}

                                        <div className="absolute top-0 left-0 text-white bg-black/40 pt-4 w-full h-full rounded-[10px] group-hover:bg-transparent group-hover:bg-black transition-bg duration-300">
                                            <div className="text-[32px] px-[1rem]">{homeResponse?.data?.storyOverlay?.heading}</div>
                                            <div className="absolute bottom-8 lg:mt-4 px-[1rem] lg:pt-[30px] pt-[22px]">
                                                <p className="text-small-con">{homeResponse?.data?.storyOverlay?.category} | {homeResponse?.data?.storyOverlay?.subCategory}</p>
                                                <p className="lg:text-[20px] text-[18px] mt-3 leading-[1.2]">
                                                    {homeResponse?.data?.storyOverlay?.title}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Suspense>

            {/* Lower priority components wrapped in separate Suspense blocks */}
            <Suspense fallback={<LoadingPlaceholder />}>
                {/* case studies carousel */}
                <div className="mb-14">
                    <div className="container">
                        <h2 className="text-start lg:text-center text-head text-con-dark mb-12">{homeResponse?.data?.caseStudyHeading}</h2>
                    </div>
                    <div className="px-5">
                        <StudyCarousel slides={studySlides} />
                    </div>
                </div>
            </Suspense>

            <Suspense fallback={<LoadingPlaceholder />}>
                {/* our clients */}
                <div className="light-bg lg:py-14 py-10">
                    <div className="container">
                        <h2 className="text-start lg:text-center text-head text-con-dark mb-12">{homeResponse?.data?.clientsHeading}</h2>
                    </div>
                    <ClientCarousel slides={clientSlide} />
                </div>
            </Suspense>

            <Suspense fallback={<LoadingPlaceholder />}>
                {/* path to success */}
                <div className="relative w-full h-[600px] mb-14" id="pathToSuccess">
                    {isMobile ? (
                        <div className="lg:hidden absolute inset-0">
                            {homeResponse?.data?.insightMobileImg?.url && (
                                <Image
                                    src={homeResponse?.data?.insightMobileImg?.url}
                                    alt="Mobile Banner"
                                    fill
                                    className="object-cover"
                                    loading="lazy"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="hidden lg:block absolute inset-0">
                            {homeResponse?.data?.insightDeskImg?.url && (
                                <Image
                                    src={homeResponse?.data?.insightDeskImg?.url}
                                    alt="Desktop Banner"
                                    fill
                                    className="object-cover"
                                    loading="lazy"
                                />
                            )}
                        </div>
                    )}
                    {/* Overlay Content */}
                    <div className="relative z-10 h-full text-white bg-black/40">
                        <div className="lg:px-0 px-[5%] absolute lg:left-[40%] left-0 top-[50%] -translate-y-1/2 lg:w-1/2 w-full">
                            <h2 className="text-2xl lg:text-[3.2rem] mb-[1rem] leading-[1]">
                                {homeResponse?.data?.insightHeading}
                            </h2>
                            <ExtendLink title={homeResponse?.data?.insightLinkTitle} href={homeResponse?.data?.insightLinkHref} className="text-white" />
                        </div>
                    </div>
                </div>
            </Suspense>

            <Suspense fallback={<LoadingPlaceholder />}>
                {/* join our team */}
                <div className="mb-14" id="joinTheTeam">
                    <div className="container">
                        <JoinTheTeam />
                    </div>
                </div>
            </Suspense>

            <Suspense fallback={<LoadingPlaceholder />}>
                {/* testimonial */}
                <div className="light-bg py-14">
                    <div className="container">
                        <h2 className="text-center text-head text-con-dark mb-12">{homeResponse?.data?.clientTestimonialHeading}</h2>
                        <TestimonialCarousel slides={testimonialSlides} />
                    </div>
                </div>
            </Suspense>

            <Suspense fallback={<LoadingPlaceholder />}>
                {/* contact */}
                <div className="flex flex-col lg:flex-row" id="howCanWeHelp">
                    <div className="lg:basis-[50%] basis-full bg-[var(--mainColor)] lg:p-[13%] p-[5rem]">
                        <h2 className="text-center lg:text-start lg:text-[3.2rem] text-[19px] text-white leading-[1] lg:my-[1rem] my-[2rem]">{homeResponse?.data?.learningTitle}</h2>
                        <LinkBtn linkTitle={homeResponse?.data?.learningLinkTitle} linkHref={homeResponse?.data?.learningLinkHref} className="border-white text-white hover:bg-white hover:text-[var(--mainColor)]" />
                    </div>
                    <div className="lg:basis-[50%] basis-full lg:p-[13%] p-[5rem]">
                        <h2 className="text-center lg:text-start lg:text-[3.2rem] text-[19px] leading-[1] lg:my-[1rem] my-[2rem]">{homeResponse?.data?.ReachOutFormTitle}</h2>
                        <ReachOut />
                    </div>
                </div>
            </Suspense>
        </>
    )
}

export default HomeWrapper