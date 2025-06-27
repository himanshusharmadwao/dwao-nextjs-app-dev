import React from 'react';
import ReachOut from '@/components/common/reachOut';
import { getPolicy } from '@/libs/apis/data/privacyPolicy';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import remarkGfm from 'remark-gfm'; // for features like strikethrough and tables
import rehypeRaw from 'rehype-raw'; // for raw html 
import styles from "@/styles/markdown.module.css";
import Image from 'next/image';
import { breakTitle } from '@/libs/utils';

const PrivacyPolicyWrapper = async ({ preview }) => {

    const policyResponse = await getPolicy(preview);
    const { data, error } = policyResponse;
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

    const content = policyResponse?.data?.markdownContent;
    // console.log(content)

    return (
        <>
            {/* Banner */}
            <div className="mb-14">
                <div className="mb-14">
                    <div className="relative w-full overflow-hidden">
                        <div className="relative w-full h-[410px]">
                            <div className="aspect-[7/10] hidden lg:block">
                                <Image
                                    src={policyResponse?.data?.bannerDeskImage?.url}
                                    alt="Desktop Banner"
                                    fill
                                    priority
                                    objectFit="cover"
                                />
                            </div>
                            <div className="aspect-[15/7] lg:hidden">
                                <Image
                                    src={policyResponse?.data?.bannerMobileImage?.url}
                                    alt="Mobile Banner"
                                    fill
                                    priority
                                    objectFit="cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/30 flex items-center">
                                <div className="container">
                                    <div className="text-left py-5 ">
                                        <h1 className="lg:text-[3.5vw] text-[28px] leading-[1.2] text-white">{breakTitle(policyResponse?.data?.title)}</h1>
                                        <div className="text-[17px] text-white mt-[2rem]">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeRaw]}
                                                transform={(html) => DOMPurify.sanitize(html)}
                                            >
                                                {policyResponse?.data?.bannerContent}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container">
                <h2 className="text-4xl mb-12 text-gray-800">Privacy Policy</h2>
                <div className={`${styles.markdownStyle} mb-20`}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        transform={(html) => DOMPurify.sanitize(html)}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Contact */}
            <ReachOut />
        </>
    );
};

export default PrivacyPolicyWrapper;