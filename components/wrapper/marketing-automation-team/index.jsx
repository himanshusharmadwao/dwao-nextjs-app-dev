import CustomLink from '@/components/culture/customLink'
import ImgCarousel from '@/components/culture/ImgCarousel'
import TestimonialCard from '@/components/home/testimonialCard'
import TestimonialCarousel from '@/components/home/testimonialCarousel'
import React from 'react'
import CompanyEvents from '@/components/culture/companyEvents'
import { getEvents, getSocialResponsibility, getTeams, getTestimonials } from '@/libs/apis/data/culture'
import { getImageUrl } from '@/libs/utils'
import { getReviews } from '@/libs/apis/data/reviews'

const ReviewWrapper = async ({ preview }) => {

    const testimonialsResponse = await getTestimonials();
    const teamsResponse = await getTeams();
    const eventsResponse = await getEvents();
    const socialResponsibilityResponse = await getSocialResponsibility();
    const reviewResponse = await getReviews(preview);

    const { data, error } = reviewResponse;
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

    const half = Math.ceil(testimonialsResponse?.data?.length / 2);

    const firstHalfSlides = testimonialsResponse?.data?.slice(7, half).map((testimonial, index) => (
        <TestimonialCard
            key={`first-${index}`}
            rating={testimonial?.rating}
            quote={testimonial?.quote}
            name={testimonial?.name}
            title={testimonial?.title}
            imageSrc={getImageUrl(testimonial?.icon)}
        />
    ));

    const secondHalfSlides = testimonialsResponse?.data?.slice(half).map((testimonial, index) => (
        <TestimonialCard
            key={`second-${index}`}
            rating={testimonial?.rating}
            quote={testimonial?.quote}
            name={testimonial?.name}
            title={testimonial?.title}
            imageSrc={getImageUrl(testimonial?.icon)}
        />
    ));

    return (
        <>
            {/* about culture */}
            <div className="mb-14 pt-36">
                <div className="container">
                    <div className="text-center mb-10">
                        <h1 className='font-[500] text-head mb-4'>{reviewResponse?.data?.introHeading}</h1>
                        <p className='text-small-con text-con-light md:w-[75%] inline-block'>{reviewResponse?.data?.introDescription}</p>
                    </div>
                </div>
            </div>

            {/* employee testimonials */}
            <div className="relative bg-[#f9faff] mb-14">
                <div className="absolute h-full w-full bg-[url(/culture/testimonials_bg.webp)] bg-cover bg-left-top bg-no-repeat opacity-20"></div>
                <div className="py-14">
                    <div className="relative container">
                        <h2 className="text-center text-head text-con-dark mb-12">{reviewResponse?.data?.empReviewHeading}</h2>
                        <div className="mb-14">
                            <TestimonialCarousel slides={firstHalfSlides} slider="review" />
                        </div>
                        <TestimonialCarousel slides={secondHalfSlides} slider="review" />
                    </div>
                </div>
            </div>

            <div className="mb-14">
                <div className="container">
                    <h2 className="text-head text-con-dark mb-12">{reviewResponse?.data?.teamCollabHeading}</h2>
                </div>
                <div className='ps-[calc(5%-10px)]'>
                    <ImgCarousel slides={teamsResponse.data} resConf={{ mobile: "1", tab: "2", desktop: "3.1" }} slider={"team_collaboration"} />
                </div>
            </div>

            {/* work/life balance */}
            <div className="light-bg py-12 mb-14">
                <div className="container">
                    <p className='text-small-con text-con-light mb-0'>{reviewResponse?.data?.appreciationNote}</p>
                </div>
            </div>

            {/* company events and celebrations */}
            <div className="container">
                <div className="mb-14">
                    <CompanyEvents data={eventsResponse?.data} secondaryData={reviewResponse} />
                </div>
            </div>

            {/* social responsibility/impact */}
            <div className="mb-14">
                <div className="container">
                    <div className="mb-12 text-center w-full">
                        <h2 className='mb-4 text-head font-[500]'>{reviewResponse?.data?.socialResponsibilityHeading}</h2>
                    </div>
                </div>
                <div className='ps-[calc(5%-10px)]'>
                    <ImgCarousel slides={socialResponsibilityResponse?.data} resConf={{ mobile: "1", tab: "2", desktop: "4.1" }} slider={"social_impact"} />
                </div>
            </div>

            {/* contact us */}
            <div className='bg-[var(--mainColor)] md:py-14 py-12'>
                <div className="container">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start items-center">
                        <h2 className='text-white leading-[1.4] text-[21px] md:w-[60%] md:text-start text-center md:mb-0 mb-5'>{reviewResponse?.data?.ctaDescription}</h2>
                        <CustomLink linkTitle={reviewResponse?.data?.ctaLinkTitle} linkHref={reviewResponse?.data?.ctaLinkHref} linkClass="text-small-con bg-white hover:bg-transparent text-[var(--mainColor)] hover:text-white border border-white" />
                    </div>
                </div>
            </div>

        </>
    )
}

export default ReviewWrapper