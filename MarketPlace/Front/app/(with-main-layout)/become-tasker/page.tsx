import {
  PiArrowUpRightBold,
  PiMinusCircleBold,
  PiPlusCircleBold,
  PiStarFill,
} from "react-icons/pi";
import FaqSection from "@/components/ui/FaqSection";
import LinkButton from "@/components/ui/LinkButton";
import { becomeTaskerFeatures } from "@/data/data";
import bossImg from "@/public/images/boss_img.png";
import browseJobsImg from "@/public/images/browse_jobs_img.png";
import icon from "@/public/images/complete_job_icon.png";
import ctaImg from "@/public/images/cta_img1.png";
import fav from "@/public/images/fav.png";
import setPriceImg from "@/public/images/set_price_img.png";
import Link from "next/link";
import Image from "next/image";

function page() {
  return (
    <>
      <section className="sbp-30 mt-[150px] lg:mt-[200px]">
        <div className="container rounded-3xl bg-b300">
          <div className="flex items-center justify-between gap-6 p-6 max-sm:flex-col md:p-15 lg:p-30">
            <div className="flex flex-col items-start justify-center text-white">
              <p className="heading-2">Soyez votre propre patron</p>
              <p className="pt-3 text-lg font-medium sm:text-xl md:text-2xl">
                Gagnez jusqu&apos;à 10 750€ par mois sur Servibe*
              </p>

              <div className="pb-6 pt-6 lg:pt-10">
                <Link
                  href="/sign-up"
                  className="group relative flex items-center justify-start pr-12 font-semibold"
                >
                  <span className="rounded-full bg-n900 px-6 py-3 duration-500 group-hover:translate-x-12">
                    Rejoindre Servibe
                  </span>
                  <span className="absolute right-0 top-0 translate-x-0 rounded-full bg-n900 p-[14px] text-xl !leading-none duration-500 group-hover:right-[148px] group-hover:rotate-45">
                    <PiArrowUpRightBold />
                  </span>
                </Link>
              </div>

              <p className="text-base font-medium md:text-xl">
                *Basé sur les revenus mensuels moyens du top 1%
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl">
              <Image src={bossImg} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="sbp-30">
        <div className="container grid grid-cols-12 gap-6">
          {becomeTaskerFeatures.map(({ id, icon, title, desc }) => (
            <div
              key={id}
              className="col-span-12 flex flex-col items-center justify-start rounded-full border border-n30 px-6 py-10 text-center min-[400px]:col-span-6 sm:px-8 sm:py-20 lg:col-span-3 lg:py-10 xl:py-20"
            >
              <div className="flex items-center justify-center rounded-full bg-b50 p-6">
                <span className=" text-4xl !leading-none text-b300">
                  {icon}
                </span>
              </div>
              <p className="heading-5 pb-3 pt-8">{title}</p>
              <p className="font-medium text-n300">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="stp-30 sbp-30 bg-n20">
        <div className="container grid grid-cols-12 gap-6">
          <div className="col-span-12 flex items-center justify-center rounded-2xl bg-b300 p-6 md:col-span-5 lg:p-15">
            <Image src={browseJobsImg} className="w-full rounded-2xl" alt="" />
          </div>

          <div className="col-span-12 flex flex-col items-start justify-center md:col-span-7 lg:col-span-6 lg:col-start-7">
            <p className="heading-2">
              Parcourez les opportunités{" "}
              <span className="text-b300">gratuitement</span>
            </p>
            <p className="pt-4 text-base font-medium text-n300 sm:text-lg">
              Inscrivez-vous et commencez à explorer instantanément. Activez les
              notifications sur l&apos;app Servibe pour être alerté en temps réel
              des missions qui correspondent à vos compétences.
            </p>

            <div className="pt-10 text-white">
              <LinkButton link="/sign-up" text="Rejoindre Servibe" isBlue={true} />
            </div>
          </div>
        </div>
      </section>

      <section className="stp-30 sbp-30 max-md:mt-6">
        <div className="container grid grid-cols-12 gap-6">
          <div className="col-span-12 flex flex-col items-start justify-center max-md:order-2 max-md:pt-6 md:col-span-6">
            <p className="heading-2">
              Fixez votre <span className="text-b300">tarif</span>
            </p>
            <p className="pt-4 text-base font-medium text-n300 sm:text-lg">
              Vous avez trouvé une mission qui vous plaît ? Définissez votre prix
              et faites une offre. Vous pourrez l&apos;ajuster ensuite si besoin.
            </p>

            <div className="pt-6 text-white sm:pt-10">
              <LinkButton link="/sign-up" text="Rejoindre Servibe" isBlue={true} />
            </div>
          </div>

          <div className="relative col-span-12 flex items-center justify-center rounded-xl pb-10 max-md:order-1 md:col-span-5 md:col-start-8">
            <Image src={setPriceImg} className="rounded-2xl" alt="" />

            <div className="absolute -top-8 left-0 flex items-center justify-start gap-3 rounded-xl bg-b50 px-4 py-4 sm:px-8 lg:-left-8">
              <div className="overflow-hidden rounded-full bg-white p-1">
                <Image src={ctaImg} alt="" className="w-[44px] rounded-full" />
              </div>
              <p>Besoin d&apos;aide pour monter un meuble</p>
            </div>

            <div className="absolute -bottom-10 right-2 flex flex-col items-center justify-start gap-3 rounded-xl bg-b50 px-6 py-6 md:right-0 xl:px-10 xxl:-right-8">
              <p className="font-medium">Je veux gagner</p>
              <div className="flex items-center justify-between gap-5 text-2xl text-b300">
                <PiMinusCircleBold />
                <p className="heading-2">250€</p>
                <PiPlusCircleBold />
              </div>

              <p className="rounded-full bg-b300 px-8 py-3 text-sm text-white">
                Faire une offre
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="stp-30 sbp-30 bg-n20">
        <div className="container grid grid-cols-12 gap-6">
          <div className="relative col-span-12 flex items-center justify-center rounded-2xl bg-b300 p-6 md:col-span-5">
            <div className="absolute -top-10 left-[5%] flex items-center justify-between gap-2 rounded-2xl bg-white px-3 py-2 md:left-1 lg:left-8 lg:py-4 xl:left-16 xl:px-5 xxl:left-24">
              <div className="">
                <Image src={fav} alt="" />
              </div>
              <div className="">
                <div className="flex items-center justify-between gap-2 lg:gap-5">
                  <p className="font-medium">Youpi ! C&apos;est jour de paie</p>
                  <p className="text-sm text-n300">Il y a 1min</p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex flex-col items-center justify-center rounded-2xl bg-white px-15 py-10 lg:mt-32">
              <Image src={icon} alt="" />
              <p className="pt-5 font-semibold">Bravo à toi !</p>
              <div className="flex items-center justify-center gap-2 pt-3 text-xl text-b300">
                <PiStarFill />
                <PiStarFill />
                <PiStarFill />
                <PiStarFill />
                <PiStarFill />
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col items-start justify-center md:col-span-7 lg:col-span-6 lg:col-start-7">
            <p className="heading-2">Terminez la mission. Soyez payé. Simple.</p>
            <p className="pt-4 text-base font-medium text-n300 sm:text-lg">
              Lorsque vous marquez une tâche comme terminée, une demande de paiement
              est envoyée directement au client pour qu&apos;il puisse vous payer instantanément.
            </p>

            <div className="pt-10 text-white">
              <LinkButton link="/sign-up" text="Rejoindre Servibe" isBlue={true} />
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
    </>
  );
}

export default page;
