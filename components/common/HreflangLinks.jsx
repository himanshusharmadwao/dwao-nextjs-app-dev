'use client';

import { usePathname } from 'next/navigation';

export default function HreflangLinks({ regions, region }) {
  const pathname = usePathname() || '/';
  const baseUrl = process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL;

  const pathWithoutRegion = region
    ? pathname.replace(new RegExp(`^/${region}(?=/|$)`), '')
    : pathname;
  const basePath = !pathWithoutRegion || pathWithoutRegion === '/'
    ? ''
    : pathWithoutRegion.replace(/\/$/, '');

  return (
    <>
      {regions?.map(r => {
        const slug = r?.slug;
        const hreflang = r?.hrefLang;
        if (!hreflang) return null;
        const url =
          hreflang === 'default'
            ? `${baseUrl}${basePath}`
            : `${baseUrl}/${slug}${basePath}`;
        return (
          <link
            key={hreflang}
            rel="alternate"
            hrefLang={hreflang === 'default' ? 'x-default' : hreflang}
            href={url}
          />
        );
      })}
    </>
  );
}
