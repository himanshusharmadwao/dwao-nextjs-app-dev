import Image from 'next/image';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './serviceCard.module.css'

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-50 rounded-xl lg:p-8 p-5 border border-gray-200">
      <div className="flex items-start">
        <div className="bg-blue-600 p-3 rounded-lg lg:mr-5 mr-3 lg:basis-[12%] basis-[16%] flex justify-center">
          <Image src={icon} alt="Icon Image" height={28} width={28} />
        </div>
        <div className='lg:basis-[88%] basis-[84%]'>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <div className={`prose prose-blue max-w-none text-gray-600 mb-4 ${styles.content}`}>
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;