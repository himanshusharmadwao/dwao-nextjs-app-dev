"use client";

import styles from "./ClientCarousel.module.css";
import { SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import Image from "next/image";
import { Autoplay, FreeMode } from "swiper/modules";
import dynamic from "next/dynamic";
import { memo } from "react";
import { getImageUrl } from "@/libs/utils";

const ClientCarouselFallback = () => (
  <div className="w-full h-[150px] bg-gray-200 animate-pulse"></div>
);

// Dynamically import Swiper with no SSR
const SwiperNoSSR = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  // ssr: false,
  loading: () => <ClientCarouselFallback />,
});

const ClientCarousel = ({ slides }) => {

  if (!slides?.length) return <ClientCarouselFallback />;

  return (
    <SwiperNoSSR
      slidesPerView={2}
      spaceBetween={30}
      loop={true}
      freeMode={true}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      }}
      speed={4000}
      modules={[Autoplay, FreeMode]}
      className={styles.mySwiper}
      breakpoints={{
        500: {
          slidesPerView: 3,
        },
        992: {
          slidesPerView: 6,
        },
      }}
    >
      {slides.map((item, index) => (
        <SwiperSlide key={index}>
          <Image
            src={getImageUrl(item.logo)}
            alt={item.title}
            width={150}
            height={70}
            layout='intrinsic'
            priority={index === 0} 
            loading={index === 0 ? "eager" : "lazy"}
            className="py-4 px-2 transition-transform duration-300 group-hover:scale-110"
          />
        </SwiperSlide>
      ))}
    </SwiperNoSSR>
  );
}

export default memo(ClientCarousel)