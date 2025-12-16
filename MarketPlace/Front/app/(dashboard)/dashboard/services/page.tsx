"use client";
import {
  PiArrowsCounterClockwise,
  PiCaretLeft,
  PiCaretRight,
  PiCheck,
  PiEyeFill,
  PiPencilSimple,
  PiPlus,
  PiSpinner,
  PiStarFill,
  PiTrash,
  PiX,
} from "react-icons/pi";
import { profileServicesData } from "@/data/data";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useServicesStore } from "@/stores/servicesStore";
import { Service, categoryLabels, Category } from "@/types";

function DashboardServicesPage() {
  const router = useRouter();
  const daysTagRef = useRef<HTMLUListElement>(null);
  const currentDateRef = useRef<HTMLParagraphElement>(null);
  const [currYear, setCurrYear] = useState<number>(new Date().getFullYear());
  const [currMonth, setCurrMonth] = useState<number>(new Date().getMonth());
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const { user, isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();
  const { myServices, isLoading, fetchMyServices, deleteService } = useServicesStore();

  const months: string[] = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/sign-in?redirect=/dashboard/services");
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyServices();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    renderCalendar();
  }, [currMonth, currYear]);

  const renderCalendar = () => {
    const date = new Date(currYear, currMonth, 1);
    const firstDayOfMonth = date.getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(
      currYear,
      currMonth,
      lastDateOfMonth
    ).getDay();
    const lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag: string = "";

    for (let i = firstDayOfMonth; i > 0; i--) {
      liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday: string =
        i === new Date().getDate() &&
        currMonth === new Date().getMonth() &&
        currYear === new Date().getFullYear()
          ? "active"
          : "";
      liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
      liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
    }

    if (currentDateRef.current) {
      currentDateRef.current.innerText = `${months[currMonth]} ${currYear}`;
    }
    if (daysTagRef.current) {
      daysTagRef.current.innerHTML = liTag;
    }
  };

  const handleIconClick = (direction: string) => {
    if (direction === "prev") {
      setCurrMonth(currMonth - 1);
      if (currMonth === 0) {
        setCurrYear(currYear - 1);
        setCurrMonth(11);
      }
    } else {
      setCurrMonth(currMonth + 1);
      if (currMonth === 11) {
        setCurrYear(currYear + 1);
        setCurrMonth(0);
      }
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;

    setDeleteLoading(serviceId);
    try {
      await deleteService(serviceId);
    } catch (error) {
      alert("Erreur lors de la suppression");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (authLoading) {
    return (
      <section className="mt-[100px] pt-15 flex items-center justify-center">
        <PiSpinner className="animate-spin text-4xl text-b300" />
      </section>
    );
  }

  // Combiner données API et données statiques pour fallback
  const displayServices = myServices.length > 0 ? myServices : [];

  return (
    <section className="mt-[100px] pt-15">
      <div className="4xl:large-container grid grid-cols-12 gap-6 max-4xl:px-4">
        <div className="col-span-12 flex flex-col gap-6 xl:col-span-8 3xl:col-span-9">
          {/* Header avec bouton d'ajout */}
          <div className="flex items-center justify-between">
            <h3 className="heading-3">Mes services</h3>
            <Link
              href="/dashboard/edit-service"
              className="flex items-center gap-2 rounded-xl bg-b300 px-4 py-2 font-medium text-white hover:bg-b400"
            >
              <PiPlus className="text-xl" />
              Ajouter un service
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <PiSpinner className="animate-spin text-4xl text-b300" />
            </div>
          ) : displayServices.length > 0 ? (
            displayServices.map((service) => (
              <div
                key={service._id}
                className="flex w-full items-center justify-between gap-6 rounded-2xl bg-white p-3 max-lg:flex-col"
              >
                <div className="flex items-center justify-start gap-6 max-md:flex-col xl:max-3xl:flex-col">
                  <div className="w-48 h-32 relative">
                    {service.images && service.images.length > 0 ? (
                      <img
                        src={service.images[0]}
                        className="rounded-xl w-full h-full object-cover"
                        alt={service.title}
                      />
                    ) : (
                      <div className="rounded-xl w-full h-full bg-n100 flex items-center justify-center text-n300">
                        Pas d'image
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-start gap-8">
                      <div className="flex items-center justify-start gap-2">
                        <span className="text-2xl text-y300">
                          <PiStarFill />
                        </span>
                        <p className="font-medium text-n300">
                          {service.rating?.toFixed(1) || "N/A"} ({service.reviewCount || 0})
                        </p>
                      </div>
                      <div className="flex items-center justify-start gap-2">
                        <span className="text-2xl text-b300">
                          <PiEyeFill />
                        </span>
                        <p className="font-medium text-n300">{service.views || 0} vues</p>
                      </div>
                    </div>
                    <h4 className="heading-4">{service.title}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-b50 px-3 py-1 text-sm font-medium text-b300">
                        {categoryLabels[service.category as Category] || service.category}
                      </span>
                      <span className="rounded-full bg-n20 px-3 py-1 text-sm font-medium text-n500">
                        {service.city}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          service.status === "active"
                            ? "bg-green-50 text-green-600"
                            : service.status === "pending"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {service.status === "active"
                          ? "Actif"
                          : service.status === "pending"
                          ? "En attente"
                          : "Inactif"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-6 max-md:flex-wrap 3xl:gap-16">
                  <div className="flex items-center text-center max-lg:gap-4 max-sm:flex-wrap lg:flex-col">
                    <p className="text-lg font-semibold">À partir de :</p>
                    <p className="text-2xl font-bold text-r300 lg:pb-5 lg:pt-3">
                      {service.price}€
                      {service.priceType === "hourly" && "/h"}
                    </p>
                  </div>
                  <div className="flex gap-4 lg:flex-col lg:gap-4">
                    <Link
                      className="rounded-full bg-b50 p-3 text-2xl !leading-none text-b300 hover:bg-b100"
                      href={`/dashboard/edit-service?id=${service._id}`}
                    >
                      <PiPencilSimple />
                    </Link>
                    <button
                      onClick={() => handleDelete(service._id)}
                      disabled={deleteLoading === service._id}
                      className="rounded-full bg-r50 p-3 text-2xl !leading-none text-r300 hover:bg-r100 disabled:opacity-50"
                    >
                      {deleteLoading === service._id ? (
                        <PiSpinner className="animate-spin" />
                      ) : (
                        <PiTrash />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-white p-10 text-center">
              <p className="text-n300 text-lg">Vous n'avez pas encore de services</p>
              <p className="text-n200 mt-2">Créez votre premier service pour commencer à recevoir des demandes</p>
              <Link
                href="/dashboard/edit-service"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-b300 px-6 py-3 font-medium text-white hover:bg-b400"
              >
                <PiPlus className="text-xl" />
                Créer un service
              </Link>
            </div>
          )}
        </div>

        {/* Calendrier */}
        <div className="col-span-12 md:col-span-6 xl:col-span-4 3xl:col-span-3">
          <div className="rounded-xl bg-white">
            <header className="flex items-center justify-between px-4 py-6">
              <p ref={currentDateRef} className="current-date font-semibold"></p>
              <div className="icons flex gap-2">
                <span
                  id="prev"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full text-2xl !leading-none text-n300 duration-500 hover:bg-r300 hover:text-white"
                  onClick={() => handleIconClick("prev")}
                >
                  <PiCaretLeft />
                </span>

                <span
                  id="next"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full text-2xl !leading-none text-n300 duration-500 hover:bg-r300 hover:text-white"
                  onClick={() => handleIconClick("next")}
                >
                  <PiCaretRight />
                </span>
              </div>
            </header>

            <div className="calendar p-2 sm:p-5">
              <ul className="weeks flex text-center">
                <li>Dim</li>
                <li>Lun</li>
                <li>Mar</li>
                <li>Mer</li>
                <li>Jeu</li>
                <li>Ven</li>
                <li>Sam</li>
              </ul>
              <ul
                ref={daysTagRef}
                className="days mb-5 flex flex-wrap text-center"
              ></ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardServicesPage;
