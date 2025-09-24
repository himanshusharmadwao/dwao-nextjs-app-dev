import Header from '@/components/layout/header'

import '@/styles/global.css'
import Footer from "@/components/layout/footer";
import { getRegions } from '@/libs/apis/data/menu';
import { headers } from 'next/headers';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata = {
  title: {
    template: "%s | DWAO",
    default: "DWAO"
  },
  description: "DWAO offers digital transformation and marketing services, including analytics, CRO, performance marketing, CDP, marketing automation, SEO, and more, helping businesses enhance their online presence, optimize performance, and drive growth."
};

export default async function RootLayout({ children, params }) {

  const h = await headers();
  const preview = h.get('x-preview') === '1';

  const paramsData = await params;
  const region = paramsData?.region;

  const regions = await getRegions();

  return (
    <html lang="en" className={roboto.variable}>
      <head>
        {regions?.data?.map(region => {
          const slug = region?.slug;
          const hreflang = region?.hrefLang;
          if (!hreflang) return null;
          const url =
            hreflang === "default"
              ? process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL
              : `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}/${slug}`;
          return (
            <link
              key={hreflang}
              rel="alternate"
              hrefLang={hreflang === "default" ? "x-default" : hreflang}
              href={url}
            />
          );
        })}
      </head>
      <body suppressHydrationWarning={true}>
        <Header preview={preview} region={region} />
        {children}
        <Footer preview={preview} region={region} />
      </body>
    </html>
  );
}
