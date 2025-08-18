import Header from '@/components/layout/header'

import '@/styles/global.css'
import Footer from "@/components/layout/footer";
import { getRegions } from '@/libs/apis/data/menu';
import { headers } from 'next/headers';

export const metadata = {
  title: {
    template: "%s | DWAO",
    default: "DWAO"
  },
  description: "DWAO offers digital transformation and marketing services, including analytics, CRO, performance marketing, CDP, marketing automation, SEO, and more, helping businesses enhance their online presence, optimize performance, and drive growth."
};

export default async function RootLayout({ children, params }) {

  const h = headers();
  const preview = h.get('x-preview') === '1';

  const regions = await getRegions();

  return (
    <html lang="en">
      <head>
        {regions?.data?.map(region => {
          const hreflang = region?.hrefLang;
          if (!hreflang) return null;
          const url =
            hreflang === "default"
              ? process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL
              : `${process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL}/${hreflang}`;
          return (
            <link
              key={hreflang}
              rel="alternate"
              hrefLang={hreflang}
              href={url}
            />
          );
        })}
      </head>
      <body>
        <Header preview={preview} region={params.region} />
        {children}
        <Footer preview={preview} region={params.region} />
      </body>
    </html>
  );
}
