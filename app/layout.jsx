import Header from '@/components/layout/header'

import '@/styles/global.css'
import Footer from "@/components/layout/footer";
import { getRegions } from '@/libs/apis/data/menu';
import FloatingForm from '@/components/floatingForm/FloatingForm';

export const metadata = {
  title: {
    template: "%s | DWAO",
    default: "DWAO"
  },
  description: "DWAO offers digital transformation and marketing services, including analytics, CRO, performance marketing, CDP, marketing automation, SEO, and more, helping businesses enhance their online presence, optimize performance, and drive growth."
};

export default async function RootLayout({ children }) {


  return (
    <>
      {children}
      <div className='fixed right-1 md:right-5 top-1/2 -translate-y-1/2 z-[999999] px-2 py-3'>
        <FloatingForm />
      </div>
    </>
  );
}
