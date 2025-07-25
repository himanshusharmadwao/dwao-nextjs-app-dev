import React, { Suspense } from 'react'
import Image from 'next/image'
import { getBenefitAndPerks, getCulture, getEvents, getSocialResponsibility, getTeams, getTestimonials } from '@/libs/apis/data/culture'
import { getImageUrl } from '@/libs/utils'
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import remarkGfm from 'remark-gfm'; // for features like strikethrough and tables
import rehypeRaw from 'rehype-raw'; // for raw html
import styles from './culture.module.css'

const Card = dynamic(() => import('@/components/culture/Card'), {
    loading: () => <div className="animate-pulse h-40 bg-gray-100 rounded"></div>,
});

const CustomLink = dynamic(() => import('@/components/culture/customLink'), {
    loading: () => <div className="animate-pulse h-10 bg-gray-100 rounded"></div>,
});

const ImgCarousel = dynamic(() => import('@/components/culture/ImgCarousel'), {
    loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded"></div>,
});

const TestimonialCard = dynamic(() => import('@/components/home/testimonialCard'), {
    loading: () => <div className="animate-pulse h-48 bg-gray-100 rounded"></div>,
});

const TestimonialCarousel = dynamic(() => import('@/components/home/testimonialCarousel'), {
    loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded"></div>,
});

const CompanyEvents = dynamic(() => import('@/components/culture/companyEvents'), {
    loading: () => <div className="animate-pulse h-56 bg-gray-100 rounded"></div>,
});

// Loader component for suspense fallback
const LoadingPlaceholder = () => (
    <div className="w-full h-40 bg-gray-100 animate-pulse rounded"></div>
);

const CultureWrapper = async ({ preview }) => {

    const [
        cultureResponse,
        benefitAndPerksResponse,
        testimonialsResponse,
        teamsResponse,
        eventsResponse,
        socialResponsibilityResponse
    ] = await Promise.all([
        getCulture(preview),
        getBenefitAndPerks(),
        getTestimonials(),
        getTeams(),
        getEvents(),
        getSocialResponsibility()
    ]);

    const { data, error } = cultureResponse;

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

    // console.log(cultureResponse);

    const testimonialSlides = testimonialsResponse?.data?.slice(0, 7).map((testimonial, index) => (
        <TestimonialCard
            key={index}
            rating={testimonial.rating}
            quote={testimonial.quote}
            name={testimonial.name}
            title={testimonial.title}
            imageSrc={getImageUrl(testimonial.icon)}
        />
    ));

    return (
        <>
            {/* about culture */}
            <div className="mb-14 pt-36">
                <div className="container">
                    <div className="text-center mb-10">
                        <span className='text-small-con tracking-[2px] uppercase text-[var(--mainColor)]'>{cultureResponse?.data?.introLabel}</span>
                        <h1 className='font-[500] text-head mb-4'>{cultureResponse?.data?.introHeading}</h1>
                        <p className='text-small-con text-con-light md:w-[75%] inline-block'>{cultureResponse?.data?.introDescription}
                        </p>
                    </div>
                    <div className="flex gap-[25px] flex-wrap md:flex-nowrap justify-center">
                        {cultureResponse?.data?.introVisuals?.map((src, idx) => {
                            let ptClass = "";
                            if (idx === 1 || idx === 3) ptClass = "md:pt-14";
                            else if (idx === 2) ptClass = "md:pt-24";

                            return (
                                <div
                                    key={idx}
                                    className={`basis-[calc((100%-25px)/2)] md:basis-[calc((100%-4*25px)/5)] ${ptClass}`}
                                >
                                    {src?.url && (
                                        <Image
                                            src={src?.url}
                                            width={210}
                                            height={230}
                                            alt="missing image"
                                            className="rounded-[5px]"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* <div className='flex gap-[25px] flex-wrap md:flex-nowrap justify-center'>
                        <div className='basis-[calc((100%-25px)/2)] md:basis-[calc((100%-4*25px)/5)]'>
                            <Image src="/culture/culture-img4.webp" width={210} height={230} alt="missing image" className='rounded-[5px]' />
                        </div>
                        <div className='md:pt-14 basis-[calc((100%-25px)/2)] md:basis-[calc((100%-4*25px)/5)]'>
                            <Image src="/culture/culture-img2.webp" width={210} height={230} alt="missing image" className='rounded-[5px]' />
                        </div>
                        <div className='md:pt-24 basis-[calc((100%-25px)/2)] md:basis-[calc((100%-4*25px)/5)]'>
                            <Image src="/culture/culture-img3.webp" width={210} height={230} alt="missing image" className='rounded-[5px]' />
                        </div>
                        <div className='md:pt-14 basis-[calc((100%-25px)/2)] md:basis-[calc((100%-4*25px)/5)]'>
                            <Image src="/culture/culture-img1.webp" width={210} height={230} alt="missing image" className='rounded-[5px]' />
                        </div>
                        <div className='basis-[calc((100%-25px)/2)] md:basis-[calc((100%-4*25px)/5)]'>
                            <Image src="/culture/culture-img5.webp" width={210} height={230} alt="missing image" className='rounded-[5px]' />
                        </div>
                    </div> */}
                </div>
            </div>

            {/* mission and values */}
            <div className="bg-[var(--mainColor)] w-full mb-14">
                <div className="flex h-full md:flex-row flex-col-reverse">
                    <div className='basis-full md:basis-[50%] px-[5%] py-12'>
                        <h2 className='text-white text-head font-[500] mb-4'>{cultureResponse?.data?.missionHeading}</h2>
                        <div className='text-small-con text-white mb-4'>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                transform={(html) => DOMPurify.sanitize(html)}
                            >
                                {cultureResponse?.data?.missionContent}
                            </ReactMarkdown>
                        </div>

                        <Suspense fallback={<LoadingPlaceholder />}>
                            <CustomLink linkTitle={cultureResponse?.data?.missionLinkTitle} linkHref={cultureResponse?.data?.missionLinkHref} linkClass="text-small-con bg-white hover:bg-transparent text-[var(--mainColor)] hover:text-white border border-white mt-4" />
                        </Suspense>
                    </div>
                    <div className='basis-full md:basis-[50%]'>
                        <div className="relative w-full h-[250px] md:h-full">
                            {cultureResponse?.data?.missionImage?.url && (
                                <Image
                                    src={cultureResponse?.data?.missionImage?.url}
                                    alt="missing image"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{ objectFit: "cover" }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* employee benefit and perks */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <div className="container">
                    <div className="mb-14">
                        <h2 className='mb-12 text-head font-[500] text-center'>{cultureResponse?.data?.employeeBenefitHeading}</h2>
                        <div className="flex gap-10 md:flex-row flex-col">
                            {benefitAndPerksResponse?.data?.map((benefit, index) => (
                                <Card key={index} data={benefit} />
                            ))}
                        </div>
                    </div>
                </div>
            </Suspense>

            {/* employee testimonials */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <div className="relative bg-[#f9faff] mb-14">
                    <div className="absolute h-full w-full bg-[url(/culture/testimonials_bg.webp)] bg-cover bg-left-top bg-no-repeat opacity-20"></div>
                    <div className="py-14">
                        <div className="relative container">
                            <h2 className="text-center text-head text-con-dark mb-12">{cultureResponse?.data?.empTestimonialHeading}</h2>
                            <TestimonialCarousel slides={testimonialSlides} slider="review" />
                        </div>
                    </div>
                </div>
            </Suspense>

            {/* teams and collaboration */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <div className="mb-14">
                    <div className="container">
                        <h2 className="text-head text-con-dark mb-12">{cultureResponse?.data?.teamsAndCollaborationHeading}</h2>
                    </div>
                    <div className='container'>
                        <ImgCarousel slides={teamsResponse?.data} resConf={{ mobile: "1", tab: "2", desktop: "3.1" }} slider={"team_collaboration"} />
                    </div>
                </div>
            </Suspense>

            {/* career growth and development */}
            <div className="container">
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 mb-14">
                    {/* left section */}
                    <div className="basis-full md:basis-1/2 mb-8 md:mb-0">
                        <h2 className="text-head text-con-dark mb-4">{cultureResponse?.data?.growthHeading}</h2>
                        <div className={`text-small-con text-con-light mb-6 ${styles.growthContentStyle}`}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                transform={(html) => DOMPurify.sanitize(html)}
                            >
                                {cultureResponse?.data?.growthContent}
                            </ReactMarkdown>
                        </div>
                        {/* <ul className="list-none space-y-2 text-con-light text-small-con mb-10">
                            <li className="flex items-center font-semibold">
                                <Image src="/icons/circle-check.svg" height={20} width={20} alt="missing image" className='me-4' />
                                Training
                            </li>
                            <li className="flex items-center font-semibold">
                                <Image src="/icons/circle-check.svg" height={20} width={20} alt="missing image" className='me-4' />
                                Learning Opportunities
                            </li>
                            <li className="flex items-center font-semibold">
                                <Image src="/icons/circle-check.svg" height={20} width={20} alt="missing image" className='me-4' />
                                Certifications
                            </li>
                        </ul> */}
                        <Suspense fallback={<LoadingPlaceholder />}>
                            <CustomLink linkTitle={cultureResponse?.data?.growthLinkTitle} linkHref={cultureResponse?.data?.growthLinkHref} linkClass="text-small-con bg-[var(--mainColor)] hover:bg-transparent text-white hover:text-[var(--mainColor)] border border-[var(--mainColor)]" />
                        </Suspense>
                    </div>

                    {/* right section */}
                    <div className="basis-full md:basis-1/2 relative">
                        {cultureResponse?.data?.growthImage?.url && (
                            <Image
                                src={cultureResponse?.data?.growthImage?.url}
                                alt="missing image"
                                width={500}
                                height={400}
                                className="object-cover"
                            />
                        )}
                        <div className="absolute bottom-4 md:right-[-5px] right-[-10px] bg-[var(--mainColor)] text-white text-center px-7 py-4 ">
                            <span className="text-[40px] font-bold">{cultureResponse?.data?.growthStatFigure}</span>
                            <p className="text-sm">{cultureResponse?.data?.growthStatDescription}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* work/life balance */}
            <div className="light-bg py-12 mb-14">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:text-start text-center">
                        <div className="basis-[20%]">
                            <span className='text-small-con tracking-[2px] uppercase text-[var(--mainColor)]'>{cultureResponse?.data?.workLabel}</span>
                            <h2 className='font-[500] text-head mb-4'>{cultureResponse?.data?.workHeading}</h2>
                        </div>
                        <div className="basis-[80%]">
                            <p className='text-small-con text-con-light mb-0'>{cultureResponse?.data?.workDescription}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* company events and celebrations */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <div className="container">
                    <div className="mb-14">
                        <CompanyEvents data={eventsResponse?.data} secondaryData={cultureResponse} />
                    </div>
                </div>
            </Suspense>

            {/* social responsibility/impact */}
            <div className="mb-14">
                <div className="container">
                    <div className="mb-12 text-center w-full">
                        <h2 className='mb-4 text-head font-[500]'>{cultureResponse?.data?.socialHeading}</h2>
                        <p className='text-small-con text-con-light md:w-[70%] mx-auto'>{cultureResponse?.data?.socialDescription}
                        </p>
                    </div>
                </div>
                <div className='container'>
                    <Suspense fallback={<LoadingPlaceholder />}>
                        <ImgCarousel slides={socialResponsibilityResponse?.data} resConf={{ mobile: "1", tab: "2", desktop: "4.1" }} slider={"social_impact"} />
                    </Suspense>
                </div>
            </div>

            {/* contact us */}
            <div className='bg-[var(--mainColor)] md:py-14 py-12'>
                <div className="container">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start items-center">
                        <h2 className='text-white leading-[1.4] text-[21px] md:w-[60%] md:text-start text-center md:mb-0 mb-5'>{cultureResponse?.data?.ctaDescription}</h2>
                        <Suspense fallback={<LoadingPlaceholder />}>
                            <CustomLink linkTitle={cultureResponse?.data?.ctaLinkTitle} linkHref={cultureResponse?.data?.ctaLinkHref} linkClass="text-small-con bg-white hover:bg-transparent text-[var(--mainColor)] hover:text-white border border-white" />
                        </Suspense>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CultureWrapper
