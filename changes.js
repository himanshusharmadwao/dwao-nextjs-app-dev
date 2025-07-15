changes

1.
C: \work\dwao - live\dwao - nextjs - app\components\common\clientCarousel\index.jsx
    <SwiperSlide SwiperSlide SwiperSlide key = { index } >
        <Image
            src={getImageUrl(item.logo)}
            alt={item.title}
            width={150}
            height={70}
            layout='intrinsic'
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            className="py-4 px-2 transition-transform duration-300 group-hover:scale-110"
        />
        </SwiperSlide >



2.
    C: \work\dwao - live\dwao - nextjs - app\components\culture\ImgCarousel\ImgCarousel.module.css
        .mySwiper {
    /* padding: 20px; */
}

3.
C: \work\dwao - live\dwao - nextjs - app\components\home\banner\Banner.module.css
    .customPagi {
    position: absolute;
    z - index: 9999;
    left: calc(50 % + 19px)!important;
    bottom: 12 % !important;
    transform: translateX(-50 %);
    width: 90 % !important;
    max - width: 1200px;
    height: 200px;
    display: flex;
    justify - content: center;
    flex - direction: column;
    gap: 50px;
}

4.
C: \work\dwao - live\dwao - nextjs - app\components\home\banner\index.jsx
    < div className = "absolute lg:top-[25%] top-[15%] left-1/2 transform -translate-x-1/2 max-w-[1200px] w-[90%] z-10" >


5.
C: \work\dwao - live\dwao - nextjs - app\components\layout\header\Header.module.css
            .cssmenu {
    position: relative;
    max - width: 1200px; //this one
    width: 90 %;
    margin: 0 auto;
    justify - content: space - between;
    align - items: center;
    display: flex;
}

6.
C: \work\dwao - live\dwao - nextjs - app\components\ui\accordion\index.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import remarkGfm from 'remark-gfm'; // for features like strikethrough and tables
import rehypeRaw from 'rehype-raw'; // for raw html 
import styles from "./Accordion.module.css";
import markStyles from "@/styles/markdown.module.css";

const Accordion = ({ data }) => {
    // console.log(data)
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-full">
            <div className="accordion-wrapper">
                {/* Accordion Header */}
                <button
                    onClick={toggleAccordion}
                    className={`w-full flex items-center justify-between px-4 py-3 bg-white border-b ${isOpen ? "border-[var(--mainColor)]" : "border-gray-200"} transition-all duration-300 hover:bg-gray-50 cursor-pointer outline-none`}
                >
                    <span className="lg:text-[20px] text-[17px] text-left">{data?.heading}</span>
                    <span className="relative w-5 h-5 flex items-center justify-center">
                        <span className="absolute w-3 h-0.5 bg-gray-800 rounded-full transition-all duration-300"></span>
                        <span
                            className={`absolute w-3 h-0.5 bg-gray-800 rounded-full transition-all duration-300 rotate-90 ${isOpen ? "opacity-0" : ""}`}
                        ></span>
                    </span>
                </button>

                {/* Accordion Content */}
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out text-con ${isOpen ? "max-h-96" : "max-h-0"
                        } bg-white`}
                >
                    <div className="p-4">
                        <div className={`${styles.accordionStyle} ${markStyles.markdownStyle}`}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                transform={(html) => DOMPurify.sanitize(html)}
                            >
                                {data?.markdownContent}
                            </ReactMarkdown>
                        </div>
                        <Link prefetch={false}
                            href={data?.linkHref || '/'}
                            className="mt-4 flex gap-2 items-center group hover:text-[var(--mainColor)] uppercase"
                            aria-label="Learn more about our services"
                        >
                            {data?.linkTitle || 'Learn More'} <span className="transition-all duration-300 group-hover:translate-x-[10px] ">
                                <Image src="/icons/theme-right-arrow.svg" height={30} width={30} alt="missing image" />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accordion;







7.
C: \work\dwao - live\dwao - nextjs - app\components\wrapper\about\index.jsx

import React, { Suspense } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { getAboutData } from '@/libs/apis/data/about'
import { getClients } from '@/libs/apis/data/home'
import { breakTitle, getImageUrl } from '@/libs/utils'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import remarkGfm from 'remark-gfm'; // for features like strikethrough and tables
import rehypeRaw from 'rehype-raw'; // for raw html 

const ClientCarousel = dynamic(() => import('@/components/common/clientCarousel'), {
    loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
})

const ProfileCard = dynamic(() => import('@/components/about/profileCard'), {
    loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
})

const JoinTheTeam = dynamic(() => import('@/components/common/joinTheTeam'), {
    loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
})

const ReachOut = dynamic(() => import('@/components/common/reachOut'), {
    loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
})

const ExtendLink = dynamic(() => import("@/components/ui/extendLink"));

const OverlayCard = dynamic(() => import('@/components/common/overlayCard'), {
    loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
})

// Loader component for suspense fallback
const LoadingPlaceholder = () => (
    <div className="w-full h-40 bg-gray-100 animate-pulse rounded"></div>
);

const AboutWrapper = async ({ preview }) => {

    const aboutResponse = await getAboutData(preview);
    // console.log(aboutResponse);
    const { data, error } = aboutResponse;
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

    const clientsResponse = await getClients();

    const clientSlide = clientsResponse.data.filter((item, index) => {
        return item.service === "main"
    })

    return (
        <>
            {/* banner */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <div className="mb-14">
                    <div className="relative w-full overflow-hidden">
                        <div className="relative w-full h-[410px]">
                            <div className="aspect-[7/10] hidden lg:block">
                                {aboutResponse?.data?.bannerDeskImage?.url && (
                                    <Image
                                        src={aboutResponse?.data?.bannerDeskImage?.url}
                                        alt="Desktop Banner"
                                        fill
                                        priority
                                        objectFit="cover"
                                    />
                                )}
                            </div>
                            <div className="aspect-[15/7] lg:hidden">
                                {aboutResponse?.data?.bannerMobileImage?.url && (
                                    <Image
                                        src={aboutResponse?.data?.bannerMobileImage?.url}
                                        alt="Mobile Banner"
                                        fill
                                        priority
                                        objectFit="cover"
                                    />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/30 flex items-center">
                                <div className="container">
                                    <div className="text-left py-5 ">
                                        <h1 className="lg:text-[3.5vw] text-[28px] leading-[1.2] text-white">{breakTitle(aboutResponse?.data?.title)}</h1>
                                        <div className="text-[17px] text-white mt-[2rem]">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeRaw]}
                                                transform={(html) => DOMPurify.sanitize(html)}
                                            >
                                                {aboutResponse?.data?.bannerContent}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Suspense>

            {/* intro */}
            <div className="container" id='whoWeAre'>
                <div className="grid grid-cols-1 lg:grid-cols-2 mb-14">
                    <h2 className='text-head-large text-con-dark leading-[1] mb-5 lg:mb-0'>{aboutResponse?.data?.intro?.title}</h2>
                    <div>
                        <div className='text-small-con text-con-light'>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                transform={(html) => DOMPurify.sanitize(html)}
                            >
                                {aboutResponse?.data?.intro?.markdownContent}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

            {/* work place */}
            <div className="light-bg py-14" id='greatPlace'>
                <div className="container">
                    <h2 className='text-[1.2rem] lg:text-head-large text-con-dark lg:mb-12 mb-5'>{aboutResponse?.data?.workPlace.title}</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {aboutResponse?.data?.workPlace?.image?.url && (
                            <Image
                                src={aboutResponse?.data?.workPlace?.image?.url}
                                alt="missing image"
                                width={476}
                                height={268}
                                priority
                                className='mb-5 lg:mb-0'
                            />
                        )}
                        <div className='flex items-center'>
                            <div className='text-small-con text-con-light'>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    transform={(html) => DOMPurify.sanitize(html)}
                                >
                                    {aboutResponse?.data?.workPlace?.markdownContent}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* what we beleive */}
            <div id='believe'>
                {aboutResponse?.data?.valueVisual?.url && (
                    <Image
                        src={aboutResponse?.data?.valueVisual?.url}
                        alt='missing image'
                        width={500}
                        height={620}
                        className='object-cover'
                        layout="responsive"
                    />
                )}
            </div>

            {/* our clients */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <div className="light-bg lg:py-14 py-10" id='clients'>
                    <div className="container">
                        <h2 className="text-start lg:text-center text-head text-con-dark mb-12">Some of our clients</h2>
                    </div>
                    <ClientCarousel slides={clientSlide} />
                </div>
            </Suspense>

            {/* success partners */}
            <div className="light-bg py-14 mb-14">
                <div className="container">
                    <h2 className='text-head-large text-con-dark mb-12'>Our partners in success</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {aboutResponse?.data?.partner?.image?.url && (
                            <Image
                                src={aboutResponse?.data?.partner?.image?.url}
                                alt="missing image"
                                width={476}
                                height={268}
                                priority
                                className='mb-5 lg:mb-0'
                            />
                        )}
                        <div className='flex items-center'>
                            <div className='text-small-con text-con-light'>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    transform={(html) => DOMPurify.sanitize(html)}
                                >
                                    {aboutResponse?.data?.partner?.markdownContent}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* services */}
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 mb-24">
                    <h2 className='text-head-large text-con-dark leading-[1] mb-5 lg:mb-0'>Our Services</h2>
                    <div>
                        <div className='text-small-con text-con-light'>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                transform={(html) => DOMPurify.sanitize(html)}
                            >
                                {aboutResponse?.data?.service?.markdownContent}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

            {/* industries */}
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 mb-24">
                    <h2 className='text-head-large text-con-dark leading-[1] mb-5 lg:mb-0'>The industries that we serve</h2>
                    <div>
                        <div className='text-small-con text-con-light'>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                transform={(html) => DOMPurify.sanitize(html)}
                            >
                                {aboutResponse?.data?.industry?.markdownContent}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

            {/* impact */}
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 mb-24">
                    <h2 className='text-head-large text-con-dark leading-[1] mb-5 lg:mb-0'>360 Impact</h2>
                    <div>
                        <div className='text-small-con text-con-light'>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                transform={(html) => DOMPurify.sanitize(html)}
                            >
                                {aboutResponse?.data?.impact?.markdownContent}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

            {/* our work */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <div className="container">
                    <div className="mb-14">
                        <div className="grid grid-cols-1 lg:grid-cols-2 grid-flow-dense">
                            <div className='flex flex-col justify-center lg:gap-4 mt-10 lg:mt-0 lg:order-1 order-2'>
                                <h2 className='text-head-large text-con-dark leading-[1] mb-5 lg:mb-0'>{aboutResponse?.data?.demoHeading}</h2>
                                <p className='text-small-con text-con-light'>{aboutResponse?.data?.demoContent}</p>
                                <ExtendLink title={aboutResponse?.data?.demoLinkTitle} href={aboutResponse?.data?.demoLinkHref} />
                            </div>

                            <div className="relative lg:order-2 order-1 basis-full md:basis-[calc((100%-60px)/3)]">
                                <Link prefetch={false} href="/insights-and-case-studies/airtel-case-study.html" className="relative group w-full lg:inline inline-block">
                                    {aboutResponse?.data?.demoOverlay?.image?.url && (
                                        <Image
                                            src={aboutResponse?.data?.demoOverlay?.image?.url}
                                            alt="Card Image"
                                            width={394}
                                            height={293}
                                            priority
                                            className="w-full h-auto object-cover rounded-[10px]"
                                        />
                                    )}
                                    <div className="absolute top-0 left-0 text-white bg-black/40 pt-4 w-full h-full rounded-[10px] group-hover:bg-transparent group-hover:bg-black transition-bg duration-300">
                                        <div className="text-[32px] px-[1rem]">{aboutResponse?.data?.demoOverlay?.heading}</div>
                                        <div className="absolute bottom-8 lg:mt-4 px-[1rem] lg:pt-[30px] pt-[22px]">
                                            <p className="text-small-con">{aboutResponse?.data?.demoOverlay?.category} | {aboutResponse?.data?.demoOverlay?.subCategory}</p>
                                            <p className="lg:text-[20px] text-[18px] mt-3 leading-[1.2]">
                                                {aboutResponse?.data?.demoOverlay?.title}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Suspense>

            {/* experts */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <div className="light-bg py-14">
                    <div className="container">
                        <h2 className="text-start lg:text-center text-head text-con-dark mb-12">{aboutResponse?.data?.expertHeading}</h2>
                        <div className="flex gap-8 flex-col lg:flex-row">
                            {aboutResponse?.data?.expert?.map((item, index) => (
                                <ProfileCard key={index} data={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </Suspense>

            {/* join our team */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <div className="container" id='joinTheTeam'>
                    <div className="mb-14">
                        <JoinTheTeam />
                    </div>
                </div>
            </Suspense>

            {/* contact */}
            <Suspense fallback={<LoadingPlaceholder />}>
                <ReachOut />
            </Suspense>

        </>
    )
}

export default AboutWrapper


8.
C: \work\dwao - live\dwao - nextjs - app\components\wrapper\culture\index.jsx
remove this ps - [calc(5 % -10px)] and put container

9.
C: \work\dwao - live\dwao - nextjs - app\components\wrapper\home\index.jsx
    < StudyCard
key = { index }
imageSrc = { getImageUrl(card.thumbnail) }
title = { card.title }
description = { card.insightStatus }
href = {`/case-studies/${card?.stats?.industry?.toLowerCase().replace(/\s+/g, '-')}/${card?.slug}`}
            />

10.
C:\work\dwao-live\dwao-nextjs-app\components\wrapper\marketing-automation-team\index.jsx
remove this ps - [calc(5 % -10px)] and put container

11.
global.css
.container {
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  padding: 0;
}







12. /** @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Setup the bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos"
      }
    ],
    domains: ["localhost", "harmonious-thrill-30f0c37241.media.strapiapp.com", "abundant-car-e287c4d86f.media.strapiapp.com"],
  },

  // Add webpack configuration for optimizing chunks
  webpack: (config, { isServer }) => {
    // Only apply to client-side bundles
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 70000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          // Pull common third-party dependencies into a shared vendor chunk
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            reuseExistingChunk: true,
          },
          // Group common modules used across multiple pages
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          // Create dedicated chunks for larger modules
          lib: {
            test: /[\\/]node_modules[\\/](react|react-dom|next|@next)[\\/]/,
            name: 'lib',
            priority: 10,
            reuseExistingChunk: true,
          }
        },
      };
    }
    return config;
  },
};

// Export the configuration with the bundle analyzer
export default withBundleAnalyzer(nextConfig);
