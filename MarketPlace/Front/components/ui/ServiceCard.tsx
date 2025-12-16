"use client";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import settingsIcon from "@/public/images/settings_icon.png";
import tapIcon from "@/public/images/tap_icon.png";
import { Service, categoryLabels, Category } from "@/types";

// Props pour données statiques (démo)
interface StaticProps {
  img: StaticImageData;
  name: string;
  startingPrice: string;
}

// Props pour données de l'API
interface ApiProps {
  service: Service;
}

type ServiceCardProps = StaticProps | ApiProps;

function isApiProps(props: ServiceCardProps): props is ApiProps {
  return "service" in props;
}

function ServiceCard(props: ServiceCardProps) {
  // Extraire les données selon le type
  const isApi = isApiProps(props);

  const title = isApi ? props.service.title : props.name;
  const price = isApi
    ? formatPrice(props.service.price, props.service.priceType)
    : props.startingPrice;
  const priceTypeLabel = isApi ? getPriceTypeLabel(props.service.priceType) : "Prix fixe";
  const imageUrl = isApi && props.service.images?.[0] ? props.service.images[0] : null;
  const staticImg = !isApi ? props.img : null;
  const serviceId = isApi ? props.service._id : null;
  const category = isApi ? props.service.category : null;
  const tags = isApi ? props.service.tags : [];

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-n30 p-3 max-md:flex-col">
      <div className="flex items-center justify-start max-xxl:gap-2 max-sm:flex-col">
        <div className="flex items-center justify-center sm:justify-start self-stretch sm:w-[80%]">
          {staticImg ? (
            <Image src={staticImg} alt={title} className="rounded-2xl object-cover" />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="rounded-2xl object-cover w-full h-[120px] sm:h-[150px]"
            />
          ) : (
            <div className="rounded-2xl bg-n20 w-full h-[120px] sm:h-[150px] flex items-center justify-center">
              <span className="text-4xl text-n100">🛠️</span>
            </div>
          )}
        </div>
        <div className="">
          <h5 className="heading-5">{title}</h5>
          <div className="flex flex-wrap gap-1 pt-3 text-sm text-n400 xxl:pt-6">
            {category && (
              <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                <Image src={settingsIcon} alt="" />
                <span>{categoryLabels[category as Category] || category}</span>
              </p>
            )}
            {!isApi && (
              <>
                <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                  <Image src={settingsIcon} alt="" />
                  <span>Bricolage</span>
                </p>
                <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                  <Image src={tapIcon} alt="" />
                  <span>Ménage</span>
                </p>
                <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                  <Image src={tapIcon} alt="" />
                  <span>Plomberie</span>
                </p>
                <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                  <span>+4</span>
                </p>
              </>
            )}
            {tags.slice(0, 2).map((tag, idx) => (
              <p key={idx} className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                <Image src={tapIcon} alt="" />
                <span>{tag}</span>
              </p>
            ))}
            {tags.length > 2 && (
              <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                <span>+{tags.length - 2}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="felx h-full w-full flex-col items-center justify-center rounded-2xl border border-n30 px-6 py-8 text-center text-n300 md:max-w-[176px]">
        <p className="text-sm font-semibold">À PARTIR DE</p>
        <p className="py-1 font-semibold text-r300">{price}</p>
        <p className="pb-5 text-sm font-semibold">{priceTypeLabel}</p>
        <Link
          href={serviceId ? `/services/service-details?id=${serviceId}` : "/services/service-details"}
          className="relative flex items-center justify-center overflow-hidden rounded-full bg-b300 px-3 py-2 text-sm font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-4 lg:py-3"
        >
          <span className="relative z-10">Voir détails</span>
        </Link>
      </div>
    </div>
  );
}

function formatPrice(price: number, priceType: string): string {
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
}

function getPriceTypeLabel(priceType: string): string {
  switch (priceType) {
    case 'hourly':
      return 'Tarif horaire';
    case 'starting_from':
      return 'Prix de départ';
    default:
      return 'Prix fixe';
  }
}

export default ServiceCard;
