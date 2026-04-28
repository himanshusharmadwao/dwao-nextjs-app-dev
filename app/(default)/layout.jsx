import Header from '@/components/layout/header'
import Footer from "@/components/layout/footer";
import HreflangLinks from '@/components/common/HreflangLinks';
import { getRegions } from '@/libs/apis/data/menu';
import { headers } from 'next/headers';

export const metadata = {
  title: {
    template: "%s | DWAO",
    default: "DWAO"
  },
  description: "DWAO offers digital transformation and marketing services, including analytics, CRO, performance marketing, CDP, marketing automation, SEO, and more, helping businesses enhance their online presence, optimize performance, and drive growth."
};

export default async function DefaultLayout({ children }) {

  const h = await headers();
  const preview = h.get('x-preview') === '1';

  const regions = await getRegions();

  return (
    <>
      <HreflangLinks regions={regions?.data} />
      <Header preview={preview} region="default" />
      {children}
      <Footer preview={preview} region="default" />
    </>
  );
}
