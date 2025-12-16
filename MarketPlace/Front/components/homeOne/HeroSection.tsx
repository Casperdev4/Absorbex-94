"use client";
// Import Swiper styles
import "swiper/css";
// Import Swiper React components
import { PiArrowUpRightBold, PiStarFill, PiStarHalfFill } from "react-icons/pi";
import { Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { homeOneHeroSlider } from "../../data/data";
import FadeLeft from "../animation/FadeLeft";
import FadeRight from "../animation/FadeRight";
import CircleText from "../ui/CircleText";
import people5 from "@/public/images/people_plus.png";
import people1 from "@/public/images/people_small1.png";
import people2 from "@/public/images/people_small2.png";
import people3 from "@/public/images/people_small3.png";
import people4 from "@/public/images/people_small4.png";
import Image from "next/image";
import Link from "next/link";

function HeroSection() {
  return (
    <section className="relative bg-r50 pt-30 sm:pt-40 xl:pt-52">
      <div className="container relative grid grid-cols-12 max-xl:overflow-x-hidden max-md:gap-6 lg:-mb-10">
        <div className="col-span-12 sm:col-span-10 md:col-span-6 lg:col-span-5 max-xxl:overflow-hidden">
          <FadeLeft>
            <div className=" flex flex-col items-start justify-center ">
              <h5 className="heading-5 pb-3 font-[700] text-r300">
                Votre plateforme de services
              </h5>
              <div className="relative">
                <h1 className="sm:display-3 text-[32px] font-[800] text-n600 max-sm:pr-10">
                  Trouvez le bon <span className="text-r300">prestataire</span> pour
                  chaque mission
                </h1>
                <div className="absolute -bottom-2 right-2 flex items-center justify-start rounded-full border border-y600 p-1 max-[450px]:hidden sm:bottom-0 sm:right-12 md:right-32 lg:right-20 xl:bottom-2 xl:right-28 xxl:right-44">
                  <div className="overflow-hidden rounded-full bg-white p-0.5 max-lg:size-8">
                    <Image src={people1} alt="" className="rounded-full" />
                  </div>
                  <div className="-ml-2 overflow-hidden rounded-full bg-white p-0.5 max-lg:size-8 lg:-ml-4">
                    <Image src={people2} alt="" className="rounded-full" />
                  </div>
                  <div className="-ml-2 overflow-hidden rounded-full bg-white p-0.5 max-lg:size-8 lg:-ml-4">
                    <Image src={people3} alt="" className="rounded-full" />
                  </div>
                  <div className="-ml-2 overflow-hidden rounded-full bg-white p-0.5 max-lg:size-8 lg:-ml-4">
                    <Image src={people4} alt="" className="rounded-full" />
                  </div>
                  <div className="-ml-2 max-lg:size-8 lg:-ml-4">
                    <Image src={people5} alt="" className="rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </FadeLeft>
        </div>
        <div className="max-xxl:overflow-hidden sm:col-span-10 md:col-span-5 lg:col-span-4 lg:col-start-9 col-span-12">
          <FadeRight>
            <div className=" flex flex-col items-start justify-center ">
              <p className="pb-6 font-semibold text-n500">
                Accédez à un vaste réseau d'experts locaux fiables et qualifiés.
              </p>
              <div className="">
                <Link
                  href="/find-workers"
                  className="group relative flex items-center justify-start pr-12 font-semibold"
                >
                  <span className="rounded-full bg-y300 px-6 py-3 duration-500 group-hover:translate-x-12">
                    Explorer
                  </span>
                  <span className="absolute right-0 top-0 translate-x-0 rounded-full bg-y300 p-[14px] text-xl !leading-none duration-500 group-hover:right-[152px] group-hover:rotate-45">
                    <PiArrowUpRightBold />
                  </span>
                </Link>
              </div>
              <div className="flex items-center justify-start gap-6 pt-3">
                <p className="display-4 font-[800] text-n900">4.7</p>
                <div className="">
                  <p className="font-medium text-n900">
                    Basé sur plus de 10 000 avis
                  </p>
                  <div className="text-xl text-y600 flex">
                    <PiStarFill />
                    <PiStarFill />
                    <PiStarFill />
                    <PiStarFill />
                    <PiStarHalfFill />
                  </div>
                </div>
              </div>
            </div>
          </FadeRight>
        </div>
      </div>

      <CircleText />

      <div className="stp-15">
        <Swiper
          className="smooth"
          modules={[FreeMode, Autoplay]}
          autoplay={{
            delay: 1,
          }}
          slidesPerView="auto"
          loop={true}
          speed={12000}
          centeredSlides={true}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            300: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            350: {
              slidesPerView: 1.3,
              spaceBetween: 10,
            },
            450: {
              slidesPerView: 1.5,
              spaceBetween: 10,
            },
            700: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            1100: {
              slidesPerView: 3,
              spaceBetween: 24,
              centeredSlides: true,
            },
          }}
        >
          {homeOneHeroSlider.map(({ id, img, title, desc, bgColor }) => (
            <SwiperSlide key={id}>
              <div
                className={`relative flex flex-col items-end justify-start gap-10 rounded-md ${bgColor} pl-6 pt-4 md:pt-8 3xl:gap-3 3xl:px-8`}
              >
                <Link
                  href="/find-workers"
                  className="flex items-center justify-center rounded-full bg-g200 p-3 !leading-none duration-500 hover:rotate-45 hover:bg-r300 max-3xl:mr-4"
                >
                  <PiArrowUpRightBold className="" />
                </Link>

                <div className="h-full">
                  <Image src={img} alt="" className="max-h-full self-stretch" />
                </div>
                <div className="absolute left-4 top-4 md:top-8 lg:left-8">
                  <p className="heading-2 pb-3 text-white">{title}</p>
                  <p className="max-w-[240px] font-medium text-white max-sm:text-sm">
                    {desc}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default HeroSection;
