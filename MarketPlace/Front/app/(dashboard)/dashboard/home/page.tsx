"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TotalEarningOverview from "@/components/dashboard/charts/TotalEarningOverview";
import WeeklyWorksSummery from "@/components/dashboard/charts/WeeklyWorksSummery";
import Counter from "@/components/ui/NumberCounter2";
import Link from "next/link";
import {
  PiArrowUpRight,
  PiCalendarPlusBold,
  PiCaretRight,
  PiCheckSquare,
  PiEnvelopeSimpleBold,
  PiHandshake,
  PiHeart,
  PiPencilSimpleLineBold,
  PiPhoneBold,
  PiPlusBold,
  PiSpinner,
  PiStarFill,
  PiStorefront,
  PiUsers,
} from "react-icons/pi";
import { useAuthStore } from "@/stores/authStore";
import { useServicesStore } from "@/stores/servicesStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useChatStore } from "@/stores/chatStore";

function Homepage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();
  const { myServices, fetchMyServices } = useServicesStore();
  const { favorites, fetchFavorites } = useFavoritesStore();
  const { conversations, fetchConversations } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/sign-in?redirect=/dashboard/home");
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (isAuthenticated) {
        await Promise.all([
          fetchMyServices(),
          fetchFavorites(),
          fetchConversations(),
        ]);
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, [isAuthenticated]);

  if (authLoading || isLoading) {
    return (
      <section className="mt-[100px] pt-15 flex items-center justify-center min-h-[400px]">
        <PiSpinner className="animate-spin text-4xl text-b300" />
      </section>
    );
  }

  if (!user) {
    return null;
  }

  const userInfoCards = [
    {
      id: 1,
      count: myServices.length,
      title: "Mes services",
      iconBgColor: "bg-b50 text-b300",
      icon: <PiStorefront />,
      link: "/dashboard/services",
    },
    {
      id: 2,
      count: favorites.length,
      title: "Favoris",
      iconBgColor: "bg-r50 text-r300",
      icon: <PiHeart />,
      link: "/dashboard/wishlist",
    },
    {
      id: 3,
      count: conversations.length,
      title: "Conversations",
      iconBgColor: "bg-y50 text-y300",
      icon: <PiEnvelopeSimpleBold />,
      link: "/chat",
    },
    {
      id: 4,
      count: user.reviewCount || 0,
      title: "Avis reçus",
      iconBgColor: "bg-g50 text-g300",
      icon: <PiStarFill />,
      link: "/dashboard/reviews",
    },
  ];

  const summaryCards = [
    {
      id: 1,
      count: myServices.filter((s) => s.status === "active").length,
      title: "Services actifs",
      bgColor: "bg-b300",
      icon: <PiStorefront className="text-b300" />,
    },
    {
      id: 2,
      count: myServices.reduce((acc, s) => acc + (s.views || 0), 0),
      title: "Vues totales",
      bgColor: "bg-y300",
      icon: <PiUsers className="text-y300" />,
    },
    {
      id: 3,
      count: user.rating ? user.rating.toFixed(1) : "N/A",
      title: "Note moyenne",
      bgColor: "bg-g300",
      icon: <PiStarFill className="text-g300" />,
    },
    {
      id: 4,
      count: 0,
      title: "Demandes",
      bgColor: "bg-r300",
      icon: <PiHandshake className="text-r300" />,
    },
  ];

  return (
    <>
      <section className="mt-[100px]">
        <div className="4xl:large-container grid grid-cols-12 gap-6 max-4xl:container pt-15">
          <div className="col-span-12 xxl:col-span-9">
            <div className="sbp-15 flex w-full items-start justify-between gap-6 max-md:flex-col md:items-center md:gap-3">
              <h3 className="heading-3">
                Bienvenue, <br />
                {user.name}
              </h3>
              <div className="flex items-center justify-start gap-6 max-lg:flex-wrap 3xl:gap-12">
                {userInfoCards.map(({ id, count, title, iconBgColor, icon, link }) => (
                  <Link
                    key={id}
                    href={link}
                    className="flex items-center justify-start gap-3 hover:opacity-80"
                  >
                    <div
                      className={`flex items-center justify-center rounded-full p-[14px] text-3xl !leading-none ${iconBgColor}`}
                    >
                      {icon}
                    </div>
                    <div>
                      <p className="text-2xl font-medium">{count}</p>
                      <p className="font-medium text-n100">{title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="w-full rounded-2xl bg-white p-8">
              <h4 className="heading-4">Résumé de l'activité</h4>
              <div className="grid grid-cols-12 gap-3 pt-6">
                {summaryCards.map(({ id, count, title, bgColor, icon }) => (
                  <div
                    key={id}
                    className={`col-span-12 rounded-2xl ${bgColor} px-8 py-6 sm:col-span-6 xxl:col-span-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-start gap-3">
                        <div className="flex items-center justify-center rounded-full bg-white p-3 text-2xl !leading-none">
                          {icon}
                        </div>
                        <p className="text-lg font-medium text-white">{title}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-8">
                      <div className="heading-3 text-white">
                        {typeof count === "number" ? <Counter value={count} /> : count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profil utilisateur */}
          <div className="col-span-12 xxl:col-span-3">
            <div className="rounded-xl border bg-white p-8">
              <div className="flex items-start justify-between">
                {user.role === "worker" && (
                  <p className="rounded-full bg-y300 px-2 py-1 text-sm font-medium">
                    PRO
                  </p>
                )}
                <div className="flex gap-2 pt-2 ml-auto">
                  <p className="flex items-center justify-start gap-2 text-sm font-semibold !leading-none text-o300">
                    <PiStarFill /> {user.rating?.toFixed(1) || "N/A"}
                    <span className="text-n300">({user.reviewCount || 0})</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-3.5">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-b300"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-b300 flex items-center justify-center text-white text-4xl font-bold border-4 border-b50">
                    {user.name?.charAt(0) || "?"}
                  </div>
                )}
                <div className="flex w-full flex-col items-center justify-center border-b border-b50 pb-6 pt-3">
                  <div className="flex-col items-center justify-center gap-3">
                    <h5 className="heading-5">{user.name}</h5>
                  </div>
                  <p className="pt-2 text-n500">{user.city || "Ville non renseignée"}</p>
                  <p className="text-sm text-n300">
                    {user.role === "worker" ? "Prestataire" : "Utilisateur"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/dashboard/edit-profile"
                  className="flex cursor-pointer items-center justify-center rounded-full bg-n20 p-3 !leading-none hover:bg-n30"
                >
                  <PiPencilSimpleLineBold />
                </Link>
                <Link
                  href="/chat"
                  className="flex cursor-pointer items-center justify-center rounded-full bg-n20 p-3 !leading-none hover:bg-n30"
                >
                  <PiEnvelopeSimpleBold />
                </Link>
                {user.phone && (
                  <a
                    href={`tel:${user.phone}`}
                    className="flex cursor-pointer items-center justify-center rounded-full bg-n20 p-3 !leading-none hover:bg-n30"
                  >
                    <PiPhoneBold />
                  </a>
                )}
                <Link
                  href="/dashboard/edit-service"
                  className="flex cursor-pointer items-center justify-center rounded-full bg-n20 p-3 !leading-none hover:bg-n30"
                >
                  <PiPlusBold />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="4xl:large-container grid grid-cols-12 gap-6 pt-6 max-4xl:container">
          <WeeklyWorksSummery />
          <TotalEarningOverview />
        </div>
      </section>

      <section>
        <div className="4xl:large-container grid grid-cols-12 gap-6 pt-6 max-4xl:container">
          {/* Mes services récents */}
          <div className="col-span-12 rounded-2xl bg-white px-6 py-8 max-sm:overflow-x-auto lg:col-span-8">
            <div className="flex items-center justify-between pb-4">
              <h4 className="heading-4">Mes services</h4>
              <Link
                href="/dashboard/services"
                className="text-b300 font-medium hover:underline"
              >
                Voir tout
              </Link>
            </div>
            {myServices.length > 0 ? (
              <table className="w-full text-nowrap">
                <thead>
                  <tr className="w-full bg-n20 py-4 text-center text-lg font-semibold">
                    <th className="py-4">Service</th>
                    <th className="py-4">Statut</th>
                    <th className="py-4">Ville</th>
                    <th className="py-4">Prix</th>
                  </tr>
                </thead>
                <tbody className="text-center font-medium text-n300">
                  {myServices.slice(0, 5).map((service) => (
                    <tr className="w-full" key={service._id}>
                      <td className="py-3 text-left pl-4">{service.title}</td>
                      <td>
                        <div
                          className={`inline-block rounded-full px-4 py-2 text-xs ${
                            service.status === "active"
                              ? "text-green-600 bg-green-50"
                              : service.status === "pending"
                              ? "bg-yellow-50 text-yellow-600"
                              : "text-r300 bg-r50"
                          }`}
                        >
                          {service.status === "active"
                            ? "Actif"
                            : service.status === "pending"
                            ? "En attente"
                            : "Inactif"}
                        </div>
                      </td>
                      <td className="px-6">{service.city}</td>
                      <td>
                        {service.price}€{service.priceType === "hourly" && "/h"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-n300">
                <p>Vous n'avez pas encore de services</p>
                <Link
                  href="/dashboard/edit-service"
                  className="mt-4 inline-block text-b300 hover:underline"
                >
                  Créer votre premier service
                </Link>
              </div>
            )}
          </div>

          {/* Actions rapides */}
          <div className="col-span-12 rounded-2xl bg-white px-6 py-8 lg:col-span-4">
            <div className="flex items-center justify-between pb-6">
              <p className="heading-4">Actions rapides</p>
            </div>
            <div className="relative h-px">
              <div className="line-horizontal absolute left-0 top-0 h-full w-full"></div>
            </div>
            <div className="flex flex-col gap-4 pt-6">
              <Link
                href="/dashboard/edit-service"
                className="flex items-center gap-3 p-4 rounded-xl bg-b50 hover:bg-b100 transition-colors"
              >
                <PiPlusBold className="text-2xl text-b300" />
                <span className="font-medium">Créer un service</span>
              </Link>
              <Link
                href="/dashboard/edit-profile"
                className="flex items-center gap-3 p-4 rounded-xl bg-n20 hover:bg-n30 transition-colors"
              >
                <PiPencilSimpleLineBold className="text-2xl text-n500" />
                <span className="font-medium">Modifier mon profil</span>
              </Link>
              <Link
                href="/chat"
                className="flex items-center gap-3 p-4 rounded-xl bg-n20 hover:bg-n30 transition-colors"
              >
                <PiEnvelopeSimpleBold className="text-2xl text-n500" />
                <span className="font-medium">Mes messages</span>
              </Link>
              <Link
                href="/services"
                className="flex items-center gap-3 p-4 rounded-xl bg-n20 hover:bg-n30 transition-colors"
              >
                <PiStorefront className="text-2xl text-n500" />
                <span className="font-medium">Parcourir les services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Homepage;
