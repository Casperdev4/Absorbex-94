"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PiHeartFill, PiSpinner, PiTrash } from "react-icons/pi";
import { useAuthStore } from "@/stores/authStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Service, categoryLabels, Category } from "@/types";

function WishlistPage() {
  const router = useRouter();
  const [removeLoading, setRemoveLoading] = useState<string | null>(null);

  const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();
  const { favorites, isLoading, fetchFavorites, removeFavorite } = useFavoritesStore();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/sign-in?redirect=/dashboard/wishlist");
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const handleRemove = async (serviceId: string) => {
    setRemoveLoading(serviceId);
    try {
      await removeFavorite(serviceId);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setRemoveLoading(null);
    }
  };

  if (authLoading) {
    return (
      <section className="mt-[100px] pt-15 flex items-center justify-center">
        <PiSpinner className="animate-spin text-4xl text-b300" />
      </section>
    );
  }

  return (
    <section className="mt-[100px] pt-15">
      <div className="4xl:large-container grid grid-cols-12 gap-6 overflow-hidden rounded-2xl bg-white p-4 max-4xl:mx-4 sm:p-10">
        <div className="col-span-12 flex items-center justify-between">
          <h4 className="heading-4">Mes favoris</h4>
          <p className="text-n300">
            {favorites.length} service{favorites.length > 1 ? "s" : ""} sauvegardé{favorites.length > 1 ? "s" : ""}
          </p>
        </div>

        {isLoading ? (
          <div className="col-span-12 flex justify-center py-20">
            <PiSpinner className="animate-spin text-4xl text-b300" />
          </div>
        ) : favorites.length > 0 ? (
          <div className="col-span-12 flex flex-col gap-4">
            {favorites.map((favorite) => {
              const service = favorite.service as Service;
              return (
                <div
                  key={favorite._id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-n30 p-3 max-md:flex-col"
                >
                  <div className="flex items-center justify-start gap-6 max-xxl:gap-2 max-sm:flex-col">
                    <div className="w-40 h-28 flex items-center justify-center self-stretch">
                      {service.images && service.images.length > 0 ? (
                        <img
                          src={service.images[0]}
                          alt={service.title}
                          className="rounded-2xl object-cover w-full h-full"
                        />
                      ) : (
                        <div className="rounded-2xl bg-n100 w-full h-full flex items-center justify-center text-n300">
                          Pas d'image
                        </div>
                      )}
                    </div>
                    <div className="">
                      <Link href={`/services/service-details?id=${service._id}`}>
                        <h3 className="heading-4 hover:text-b300">{service.title}</h3>
                      </Link>
                      <div className="flex flex-wrap gap-1 pt-3 text-sm text-n400">
                        <span className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                          {categoryLabels[service.category as Category] || service.category}
                        </span>
                        <span className="flex items-center justify-center gap-2 rounded-xl bg-n20 px-3 py-2 font-medium">
                          {service.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 max-md:w-full max-md:justify-between">
                    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-n30 px-6 py-4 text-center text-n300">
                      <p className="text-sm font-semibold">À PARTIR DE</p>
                      <p className="py-1 font-semibold text-r300">
                        {service.price}€
                        {service.priceType === "hourly" && "/h"}
                      </p>
                      <p className="pb-3 text-sm font-semibold">
                        {service.priceType === "hourly" ? "Taux horaire" : service.priceType === "fixed" ? "Prix fixe" : "À partir de"}
                      </p>
                      <Link
                        href={`/services/service-details?id=${service._id}`}
                        className="relative flex items-center justify-center overflow-hidden rounded-full bg-b300 px-3 py-2 text-sm font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-4 lg:py-2"
                      >
                        <span className="relative z-10">Voir détails</span>
                      </Link>
                    </div>

                    <button
                      onClick={() => handleRemove(service._id)}
                      disabled={removeLoading === service._id}
                      className="rounded-full bg-r50 p-3 text-2xl text-r300 hover:bg-r100 disabled:opacity-50"
                    >
                      {removeLoading === service._id ? (
                        <PiSpinner className="animate-spin" />
                      ) : (
                        <PiTrash />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="col-span-12 text-center py-20">
            <PiHeartFill className="text-6xl text-n200 mx-auto mb-4" />
            <p className="text-n300 text-lg">Vous n'avez pas encore de favoris</p>
            <p className="text-n200 mt-2">Parcourez les services et ajoutez vos préférés</p>
            <Link
              href="/services"
              className="mt-6 inline-block rounded-xl bg-b300 px-6 py-3 font-medium text-white hover:bg-b400"
            >
              Découvrir les services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default WishlistPage;
