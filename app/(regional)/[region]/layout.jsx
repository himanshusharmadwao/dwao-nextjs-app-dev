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

export default async function RegionalLayout({ children, params }) {

  const h = await headers();
  const preview = h.get('x-preview') === '1';

  const paramsData = await params;
  const region = paramsData?.region;

  const regions = await getRegions();

  return (
    <>
      <HreflangLinks regions={regions?.data} region={region} />
      <Header preview={preview} region={region} />
      {children}
      <Footer preview={preview} region={region} />
    </>
  );
}
