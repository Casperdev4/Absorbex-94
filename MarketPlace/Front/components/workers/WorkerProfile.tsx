"use client";

import { useEffect } from "react";
import { topExperts } from "@/data/data";
import { useWorkersStore } from "@/stores/workersStore";
import { categoryLabels, Category, Service } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  PiEnvelopeSimple,
  PiMapPin,
  PiPhone,
  PiSpinner,
  PiStarFill,
} from "react-icons/pi";
import BreadCrumb from "@/components/global/BreadCrumb";
import ServiceCard from "@/components/ui/ServiceCard";

// Import expert images
import expertImg1 from "@/public/images/expert_img_1.png";
import expertImg2 from "@/public/images/expert_img_2.png";
import expertImg3 from "@/public/images/expert_img_3.png";
import expertImg4 from "@/public/images/expert_img_4.png";
import expertImg5 from "@/public/images/expert_img_5.png";
import expertImg6 from "@/public/images/expert_img_6.png";

const expertImages: { [key: string]: any } = {
  expertImg1,
  expertImg2,
  expertImg3,
  expertImg4,
  expertImg5,
  expertImg6,
};

function WorkerProfile() {
  const params = useParams();
  const workerParam = params?.name as string;
  const { currentWorker, isLoading, error, fetchWorker } = useWorkersStore();

  // Vérifier si c'est un ID MongoDB (24 caractères hexadécimaux) ou un slug de nom
  const isMongoId = /^[a-f\d]{24}$/i.test(workerParam);

  useEffect(() => {
    if (isMongoId) {
      fetchWorker(workerParam);
    }
  }, [workerParam, isMongoId]);

  // Si c'est un ID MongoDB, utiliser les données de l'API
  if (isMongoId) {
    if (isLoading) {
      return (
        <>
          <BreadCrumb pageName="Chargement..." />
          <div className="flex items-center justify-center py-40">
            <PiSpinner className="animate-spin text-5xl text-b300" />
          </div>
        </>
      );
    }

    if (error || !currentWorker) {
      return (
        <>
          <BreadCrumb pageName="Prestataire non trouvé" />
          <div className="container py-20 text-center">
            <h2 className="heading-2">Prestataire non trouvé</h2>
            <p className="pt-4 text-n500">
              {error || "Le prestataire que vous recherchez n'existe pas."}
            </p>
            <Link
              href="/find-workers"
              className="mt-6 inline-block rounded-xl bg-b300 px-8 py-3 font-semibold text-white"
            >
              Voir tous les prestataires
            </Link>
          </div>
        </>
      );
    }

    const worker = currentWorker;
    const workerServices = (worker as any).services as Service[] || [];

    return (
      <>
        <BreadCrumb pageName={worker.name} />

        <section className="stp-30 sbp-30">
          <div className="container">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Profile Info */}
              <div className="col-span-12 lg:col-span-4">
                <div className="rounded-3xl border border-n30 p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="size-32 overflow-hidden rounded-full bg-n20 flex items-center justify-center">
                      {worker.avatar ? (
                        <img
                          src={worker.avatar}
                          alt={worker.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl text-n300">👤</span>
                      )}
                    </div>
                    <h3 className="heading-4 pt-4">{worker.name}</h3>
                    <div className="flex items-center gap-2 pt-2 text-n500">
                      <PiMapPin />
                      <span>{worker.city || "France"}</span>
                    </div>
                    <div className="flex items-center gap-1 pt-2 text-y600">
                      {[...Array(5)].map((_, i) => (
                        <PiStarFill
                          key={i}
                          className={i < Math.floor(worker.rating || 0) ? "text-y600" : "text-n100"}
                        />
                      ))}
                      <span className="ml-2 text-n500">
                        ({worker.rating?.toFixed(1) || "0"}) - {worker.reviewCount || 0} avis
                      </span>
                    </div>
                    {worker.hourlyRate && (
                      <p className="mt-3 rounded-full bg-r50 px-4 py-2 font-semibold text-r300">
                        {worker.hourlyRate}€/h
                      </p>
                    )}
                  </div>

                  {worker.skills && worker.skills.length > 0 && (
                    <div className="mt-6 border-t border-n30 pt-6">
                      <h4 className="font-semibold">Compétences</h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {worker.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-b50 px-4 py-2 text-sm font-medium text-b300"
                          >
                            {categoryLabels[skill as Category] || skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      href={`/chat?workerId=${worker._id || worker.id}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-b300 px-6 py-3 font-semibold text-white"
                    >
                      <PiEnvelopeSimple className="text-xl" />
                      Contacter
                    </Link>
                    {worker.phone && (
                      <Link
                        href={`tel:${worker.phone}`}
                        className="flex items-center justify-center gap-2 rounded-xl border border-b300 px-6 py-3 font-semibold text-b300"
                      >
                        <PiPhone className="text-xl" />
                        Appeler
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Bio & Services */}
              <div className="col-span-12 lg:col-span-8">
                <div className="rounded-3xl border border-n30 p-6">
                  <h3 className="heading-4">À propos</h3>
                  <p className="pt-4 text-n500 whitespace-pre-line">
                    {worker.bio || `Professionnel expérimenté basé à ${worker.city || "France"}. Disponible pour vos projets avec un service de qualité et des tarifs compétitifs.`}
                  </p>
                </div>

                {workerServices.length > 0 && (
                  <div className="mt-6 rounded-3xl border border-n30 p-6">
                    <h3 className="heading-4">Services proposés</h3>
                    <div className="mt-6 flex flex-col gap-4">
                      {workerServices.map((service) => (
                        <ServiceCard key={service._id} service={service} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 rounded-3xl border border-n30 p-6">
                  <h3 className="heading-4">Statistiques</h3>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-xl bg-b50 p-4">
                      <p className="heading-3 text-b300">{worker.completedTasks || 0}</p>
                      <p className="text-sm text-n300">Missions</p>
                    </div>
                    <div className="rounded-xl bg-g50 p-4">
                      <p className="heading-3 text-g400">{worker.reviewCount || 0}</p>
                      <p className="text-sm text-n300">Avis</p>
                    </div>
                    <div className="rounded-xl bg-y50 p-4">
                      <p className="heading-3 text-y600">{worker.rating?.toFixed(1) || "0"}</p>
                      <p className="text-sm text-n300">Note</p>
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

  // Fallback: données statiques pour les anciens liens par nom
  const workerName = workerParam;
  const staticWorker = topExperts.find(
    (expert) =>
      expert.expertName.toLowerCase().replace(/\s+/g, "-") ===
      workerName?.toLowerCase()
  );

  if (!staticWorker) {
    return (
      <>
        <BreadCrumb pageName="Prestataire non trouvé" />
        <div className="container py-20 text-center">
          <h2 className="heading-2">Prestataire non trouvé</h2>
          <p className="pt-4 text-n500">
            Le prestataire que vous recherchez n'existe pas.
          </p>
          <Link
            href="/find-workers"
            className="mt-6 inline-block rounded-xl bg-b300 px-8 py-3 font-semibold text-white"
          >
            Voir tous les prestataires
          </Link>
        </div>
      </>
    );
  }

  const expertImage = expertImages[staticWorker.img] || expertImg1;

  return (
    <>
      <BreadCrumb pageName={staticWorker.expertName} />

      <section className="stp-30 sbp-30">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Profile Info */}
            <div className="col-span-12 lg:col-span-4">
              <div className="rounded-3xl border border-n30 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="size-32 overflow-hidden rounded-full">
                    <Image
                      src={expertImage}
                      alt={staticWorker.expertName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="heading-4 pt-4">{staticWorker.expertName}</h3>
                  <div className="flex items-center gap-2 pt-2 text-n500">
                    <PiMapPin />
                    <span>{staticWorker.location}</span>
                  </div>
                  <div className="flex items-center gap-1 pt-2 text-y600">
                    <PiStarFill />
                    <PiStarFill />
                    <PiStarFill />
                    <PiStarFill />
                    <PiStarFill />
                    <span className="ml-2 text-n500">(4.9)</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-n30 pt-6">
                  <div className="flex flex-wrap gap-2">
                    {staticWorker.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-b50 px-4 py-2 text-sm font-medium text-b300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-n30 pt-6">
                  <h4 className="font-semibold">Services</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {staticWorker.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-n20 px-4 py-2 text-sm font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/chat"
                    className="flex items-center justify-center gap-2 rounded-xl bg-b300 px-6 py-3 font-semibold text-white"
                  >
                    <PiEnvelopeSimple className="text-xl" />
                    Contacter
                  </Link>
                  <Link
                    href={`tel:+33600000000`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-b300 px-6 py-3 font-semibold text-b300"
                  >
                    <PiPhone className="text-xl" />
                    Appeler
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Portfolio */}
            <div className="col-span-12 lg:col-span-8">
              <div className="rounded-3xl border border-n30 p-6">
                <h3 className="heading-4">Portfolio</h3>
                <p className="pt-2 text-n500">
                  Découvrez les réalisations de {staticWorker.expertName}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {staticWorker.sliderImg.map((img, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-xl"
                    >
                      <Image
                        src={img}
                        alt={`Portfolio ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-n30 p-6">
                <h3 className="heading-4">À propos</h3>
                <p className="pt-4 text-n500">
                  Professionnel expérimenté basé à {staticWorker.location}.
                  Spécialisé dans {staticWorker.services.join(", ").toLowerCase()}.
                  Disponible pour vos projets avec un service de qualité et des tarifs compétitifs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default WorkerProfile;
