import '@/styles/global.css'
import { Roboto } from 'next/font/google';
import FloatingForm from '@/components/floatingForm/FloatingForm';

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

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body suppressHydrationWarning={true}>
        {children}
        <div className='fixed right-1 md:right-5 top-1/2 -translate-y-1/2 z-[999999] px-2 py-3'>
          <FloatingForm />
        </div>
      </body>
    </html>
  );
}
