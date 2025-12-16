"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  PiCalendarFill,
  PiPaperPlaneTilt,
  PiShareNetworkFill,
  PiSpinner,
  PiStarFill,
  PiHeart,
  PiHeartFill,
} from "react-icons/pi";

import BreadCrumb from "@/components/global/BreadCrumb";
import ServiceCard from "@/components/ui/ServiceCard";
import { workerServices } from "@/data/data";
import { useServicesStore } from "@/stores/servicesStore";
import { categoryLabels, Category, User } from "@/types";
import badge from "@/public/images/verify-badge.png";
import serviceDetailsImg from "@/public/images/worker-details-img.png";
import Image from "next/image";
import Link from "next/link";

function ServiceDetailsContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("id");
  const { currentService, services, isLoading, error, fetchService, fetchServices } = useServicesStore();

  useEffect(() => {
    if (serviceId) {
      fetchService(serviceId);
    }
    // Charger d'autres services pour "Plus de services"
    fetchServices({ limit: 3 });
  }, [serviceId]);

  // Si pas d'ID ou en chargement, afficher les données statiques
  const showStaticData = !serviceId || (!currentService && !isLoading);
  const service = currentService;
  const owner = service?.owner as User | undefined;

  // Formatage du prix
  const formatPrice = (price: number, priceType: string): string => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);

    switch (priceType) {
      case 'hourly':
        return `${formatted}/h`;
      case 'starting_from':
        return `À partir de ${formatted}`;
      default:
        return formatted;
    }
  };

  if (isLoading && serviceId) {
    return (
      <>
        <BreadCrumb
          pageName="Détails du service"
          isSearchBoxShow={false}
          isMiddlePage={true}
          middlePageLink="/services"
          middlePageName="Services"
        />
        <div className="flex items-center justify-center py-40">
          <PiSpinner className="animate-spin text-5xl text-b300" />
        </div>
      </>
    );
  }

  if (error && serviceId) {
    return (
      <>
        <BreadCrumb
          pageName="Détails du service"
          isSearchBoxShow={false}
          isMiddlePage={true}
          middlePageLink="/services"
          middlePageName="Services"
        />
        <div className="container py-20 text-center">
          <p className="text-red-500">{error}</p>
          <Link href="/services" className="mt-4 inline-block text-b300 underline">
            Retour aux services
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <BreadCrumb
        pageName="Détails du service"
        isSearchBoxShow={false}
        isMiddlePage={true}
        middlePageLink="/services"
        middlePageName="Services"
      />

      <section className="sbp-30 stp-30">
        <div className="container grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 overflow-hidden rounded-xl md:col-span-6">
                {service?.images?.[0] ? (
                  <img
                    src={service.images[0]}
                    className="w-full rounded-xl object-cover h-[300px]"
                    alt={service.title}
                  />
                ) : (
                  <Image
                    src={serviceDetailsImg}
                    className="w-full rounded-xl"
                    alt=""
                  />
                )}
              </div>
              <div className="col-span-12 flex flex-col items-center justify-start lg:col-span-6">
                <div className="flex flex-col items-start justify-start">
                  <h3 className="heading-3 pb-3">
                    {service?.title || "Service de nettoyage professionnel"}
                  </h3>
                  <p className="font-medium text-n300">
                    {service?.description?.slice(0, 150) || "Découvrez nos services de qualité professionnelle."}
                    {service?.description && service.description.length > 150 && "..."}
                  </p>
                  <div className="flex items-center justify-start gap-3 pt-3">
                    <div className="relative max-md:overflow-hidden">
                      <div className="hexagon-styles my-[calc(100px*0.5/2)] h-[calc(100px*0.57736720554273)] w-[100px] rounded-[calc(100px/36.75)] bg-b50 before:rounded-[calc(100px/18.75)] after:rounded-[calc(100px/18.75)]">
                        <div className="absolute -top-[20px] left-[5px]">
                          <div className="hexagon-styles z-10 my-[calc(90px*0.5/2)] h-[calc(90px*0.57736720554273)] w-[90px] rounded-[calc(90px/50)] bg-b300 before:rounded-[calc(90px/50)] after:rounded-[calc(90px/50)]">
                            <div className="absolute -top-[18px] left-[4px] z-20">
                              <div className="hexagon-styles z-10 my-[calc(82px*0.5/2)] h-[calc(82px*0.57736720554273)] w-[82px] rounded-[calc(82px/50)] bg-b50 before:rounded-[calc(82px/50)] after:rounded-[calc(82px/50)]">
                                <div className="r-hex3 absolute -left-0.5 -top-[20px] z-30 inline-block w-[86px] overflow-hidden">
                                  <div className="r-hex-inner3">
                                    {owner?.avatar ? (
                                      <div
                                        className="r-hex-inner-3 before:h-[86px] before:bg-cover"
                                        style={{ backgroundImage: `url(${owner.avatar})` }}
                                      ></div>
                                    ) : (
                                      <div className="before:bg-[url('/images/people13.png')] r-hex-inner-3 before:h-[86px] before:bg-cover"></div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {owner?.verified && (
                        <div className="absolute bottom-3 right-1 z-30">
                          <Image src={badge} alt="Vérifié" className="" />
                        </div>
                      )}
                    </div>
                    <div className="max-[350px]:max-w-20">
                      <div className="flex items-center justify-center gap-3">
                        <h5 className="heading-5">{owner?.name || "Prestataire"}</h5>
                        {owner?.verified && (
                          <p className="p rounded-full bg-y300 px-3 py-1 text-sm font-medium">
                            PRO
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-n300">{owner?.city || service?.city || "France"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex w-full items-center justify-between border-y border-n30 py-3">
                  <div className="flex items-center justify-start gap-2">
                    <span className="text-2xl !leading-none text-b300">
                      <PiStarFill />
                    </span>
                    <p className="text-n300">
                      {service?.rating ? (
                        <span>{service.rating.toFixed(1)} ({service.reviewCount} avis)</span>
                      ) : (
                        "Pas encore d'avis"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-2xl !leading-none text-b300 hover:text-r300 transition-colors">
                      {service?.isFavorite ? <PiHeartFill className="text-r300" /> : <PiHeart />}
                    </button>
                    <span className="text-2xl !leading-none text-b300">
                      <PiShareNetworkFill />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="stp-15 sbp-15">
              <h3 className="heading-3 border-b border-n30 pb-5">
                À propos de ce service
              </h3>
              <div className="flex flex-col gap-8 pt-5 text-lg">
                <div className="flex flex-col gap-3">
                  <p className="text-n300 whitespace-pre-line">
                    {service?.description || `Notre mission est de transformer votre espace en un havre propre et accueillant où vous pouvez vous détendre, travailler et vous épanouir. Nous nous efforçons de dépasser vos attentes en fournissant des solutions de nettoyage fiables, efficaces et personnalisées qui améliorent votre qualité de vie.

Nous adoptons une approche personnalisée du nettoyage, comprenant que chaque espace est unique et nécessite une attention individualisée. Notre équipe de nettoyeurs professionnels est formée pour nettoyer et assainir méticuleusement votre maison, bureau ou espace commercial en utilisant des produits écologiques et des équipements de pointe.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="stp-15 sbp-15 flex flex-col items-center justify-center gap-8 border-y border-n30">
              <h2 className="heading-2">Travaillez avec moi</h2>
              <div className="max-w-[300px]">
                <Link
                  href={owner ? `/chat?workerId=${typeof owner === 'object' ? owner.id || owner._id : owner}` : "/chat"}
                  className="relative block w-full overflow-hidden rounded-full bg-n700 px-6 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)]"
                >
                  <div className="relative z-20 flex items-center justify-center gap-3">
                    <span className="text-xl !leading-none">
                      <PiPaperPlaneTilt />
                    </span>
                    <span>Me contacter</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-n30 p-4 sm:mt-14 sm:p-8">
              <h5 className="heading-5">Autres services</h5>

              <div className="flex flex-col gap-4 pt-10">
                {services.length > 0 ? (
                  services
                    .filter((s) => s._id !== service?._id)
                    .slice(0, 2)
                    .map((s) => <ServiceCard key={s._id} service={s} />)
                ) : (
                  workerServices.slice(0, 2).map(({ id, ...props }) => (
                    <ServiceCard key={id} {...props} />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-32">
              <div className="items-center rounded-2xl border border-n30 px-6 py-8 text-center text-n300">
                <div className="border-b border-n30 pb-6">
                  <p className="text-sm font-semibold">À PARTIR DE</p>
                  <p className="heading-5 py-1 font-semibold text-r300">
                    {service ? formatPrice(service.price, service.priceType) : "75€ - 100€/h"}
                  </p>

                  <div className="pt-3">
                    <Link
                      href={owner ? `/chat?workerId=${typeof owner === 'object' ? owner.id || owner._id : owner}` : "/chat"}
                      className="relative block w-full overflow-hidden rounded-full bg-n700 px-6 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)]"
                    >
                      <div className="relative z-20 flex items-center justify-center gap-3">
                        <span className="text-xl !leading-none">
                          <PiPaperPlaneTilt />
                        </span>
                        <span>Me contacter</span>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start pt-6">
                  {service?.deliveryTime && (
                    <>
                      <p className="text-sm font-medium">Délai</p>
                      <p className="flex items-center justify-start gap-2 pt-3 text-sm">
                        <span className="text-2xl text-b300">
                          <PiCalendarFill />
                        </span>
                        {service.deliveryTime}
                      </p>
                    </>
                  )}
                  <p className="pt-6 text-sm font-medium">
                    Catégorie et tags
                  </p>
                  <div className="flex flex-wrap gap-1 pt-3 text-sm text-n400">
                    {service?.category && (
                      <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2">
                        <span>{categoryLabels[service.category as Category] || service.category}</span>
                      </p>
                    )}
                    {service?.tags?.map((tag, idx) => (
                      <p key={idx} className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2">
                        <span>{tag}</span>
                      </p>
                    ))}
                    {!service && (
                      <>
                        <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2">
                          <span>Bricolage</span>
                        </p>
                        <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2">
                          <span>Nettoyage</span>
                        </p>
                        <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2">
                          <span>Rénovation</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceDetailsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-40">
        <PiSpinner className="animate-spin text-5xl text-b300" />
      </div>
    }>
      <ServiceDetailsContent />
    </Suspense>
  );
}

export default ServiceDetailsPage;
