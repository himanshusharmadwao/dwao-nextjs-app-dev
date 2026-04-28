import React from 'react';
import ComplianceItem from '@/components/complianceItem';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import styles from "@/styles/markdown.module.css";
import Image from 'next/image';
import { breakTitle, getImageUrl } from '@/libs/utils';
import { getRegions } from '@/libs/apis/data/menu';
import SafeMarkdownComp from '@/components/common/SafeMarkdownComp';

const ComplianceWrapper = async ({ complianceResponse, preview, region = "default" }) => {

    const content = complianceResponse?.markdownContent;
    const compliances = complianceResponse?.compliances || [];
    const regions = await getRegions();

    return (
        <>
            {/* Banner */}
            <div className="mb-14">
                <div className="relative w-full overflow-hidden">
                    <div className="relative w-full h-[410px]">
                        <div className="aspect-[7/10] hidden lg:block">
                            <Image
                                src={getImageUrl(complianceResponse?.bannerDeskImage)}
                                alt="Desktop Banner"
                                fill
                                priority
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="aspect-[15/7] lg:hidden">
                            <Image
                                src={getImageUrl(complianceResponse?.bannerMobileImage)}
                                alt="Mobile Banner"
                                fill
                                priority
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="absolute inset-0 bg-black/30 flex items-center">
                            <div className="container">
                                <div className="text-left py-5 ">
                                    <h1 className="lg:text-[3.5vw] text-[28px] leading-[1.2] text-white">{breakTitle(complianceResponse?.title)}</h1>
                                    <div className="text-[17px] text-white mt-[2rem]">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw]}
                                            transform={(html) => DOMPurify.sanitize(html)}
                                        >
                                            {complianceResponse?.bannerContent}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container">
                {content && (
                    <div className={`${styles.markdownStyle} mb-16`}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            transform={(html) => DOMPurify.sanitize(html)}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                )}

                {/* Compliances list */}
                <div className="mb-20">
                    {compliances.map((item, index) => (
                        <ComplianceItem key={item?.id || index} data={item} region={region} regions={regions?.data} />
                    ))}
                </div>
            </div>

            {/* region block */}
            {(() => {
                const matchedBlock = (region && region !== "default" && region !== "in-en") ? complianceResponse?.regionBlocks?.find(rb => rb.region?.some(r => r.slug === region)) : null;
                return matchedBlock ? (
                    <div className="container">
                        <div className="mb-14">
                            <SafeMarkdownComp>
                                {matchedBlock.description}
                            </SafeMarkdownComp>
                        </div>
                    </div>
                ) : null;
            })()}

        </>
    );
};

export default ComplianceWrapper;
