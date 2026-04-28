import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import styles from "@/styles/markdown.module.css";
import { getImageUrl, buildRegionalPath } from '@/libs/utils';
import CustomLink from '@/components/culture/customLink';

const isExternalLink = (href = "") => /^(https?:|mailto:|tel:|#)/i.test(href);

const ComplianceItem = ({ data, region = "default", regions = [] }) => {
    const { image, ctaTitle = "", ctaHref = "", content = "", title = "" } = data || {};

    const linkHref = ctaHref
        ? (isExternalLink(ctaHref) ? ctaHref : buildRegionalPath(ctaHref, region, regions))
        : "#";
    const linkTitle = ctaTitle;

    return (
        <div>
            {title && <h3 className="text-3xl mb-4 text-gray-800 mb-2">{title}</h3>}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center mb-16">
                <div className="lg:basis-[25%] basis-full flex justify-center">
                    <Image
                        src={getImageUrl(image)}
                        alt={title || "compliance image"}
                        width={150}
                        height={150}
                        className="object-contain rounded-[10px] w-[150px] h-[150px]"
                    />
                </div>
                <div className="lg:basis-[75%] basis-full">
                    <div className={styles.markdownStyle}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            transform={(html) => DOMPurify.sanitize(html)}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                    {linkTitle && (
                        <div className="mt-6 lg:text-left">
                            <CustomLink linkTitle={linkTitle} linkHref={linkHref}  target="_blank" linkClass="text-small-con bg-[var(--mainColor)] hover:bg-transparent text-white hover:text-[var(--mainColor)] border border-[var(--mainColor)]" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplianceItem;
