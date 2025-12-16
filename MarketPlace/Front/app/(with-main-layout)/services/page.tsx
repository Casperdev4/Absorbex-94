"use client";
import { useEffect, useState } from "react";
import BreadCrumb from "@/components/global/BreadCrumb";
import Pagination from "@/components/ui/Pagination";
import ServiceCard from "@/components/ui/ServiceCard";
import { workerServices } from "@/data/data";
import { useServicesStore } from "@/stores/servicesStore";
import { categoryLabels } from "@/types";
import { PiSpinner } from "react-icons/pi";

function ServicesPage() {
  const { services, pagination, isLoading, error, fetchServices, setFilters } = useServicesStore();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    fetchServices().then(() => setHasLoaded(true));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: Record<string, string> = {};
    if (keyword) filters.search = keyword;
    if (location) filters.city = location;
    if (category) filters.category = category;
    setFilters(filters);
    fetchServices(filters);
  };

  const handlePageChange = (page: number) => {
    fetchServices({ page });
  };

  // Utiliser les données de l'API si disponibles, sinon les données statiques
  const showApiData = hasLoaded && services.length > 0;

  return (
    <>
      <BreadCrumb pageName="Tous les services" isSearchBoxShow={true} />

      <section className="sbp-30 stp-30">
        <div className="container grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <form onSubmit={handleSearch} className="rounded-xl border border-n30 px-6 py-8">
              <h5 className="heading-5">Filtrer par</h5>
              <div className="flex flex-col gap-6 pt-8">
                <div className="rounded-xl bg-n10 p-6">
                  <p className="pb-3 text-lg font-semibold">Mot-clé</p>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-n40 bg-transparent px-4 py-3 outline-none"
                    placeholder="Que recherchez-vous ?"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="rounded-xl bg-n10 p-6">
                  <p className="pb-3 text-lg font-semibold">Ville</p>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-n40 bg-transparent px-4 py-3 outline-none"
                    placeholder="Entrez une ville"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="rounded-xl bg-n10 p-6">
                  <p className="pb-3 text-lg font-semibold">Catégorie</p>
                  <select
                    className="w-full rounded-xl border border-n40 bg-transparent px-4 py-3 outline-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Toutes les catégories</option>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative flex items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3 disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading && <PiSpinner className="animate-spin" />}
                    Rechercher
                  </span>
                </button>
              </div>
            </form>
          </div>

          <div className="col-span-12 rounded-xl border border-n30 p-4 sm:p-8 lg:col-span-8">
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-500">
                {error}
              </div>
            )}

            {isLoading && !hasLoaded ? (
              <div className="flex items-center justify-center py-20">
                <PiSpinner className="animate-spin text-4xl text-b300" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {showApiData ? (
                  services.map((service) => (
                    <ServiceCard key={service._id} service={service} />
                  ))
                ) : (
                  workerServices.map(({ id, ...props }) => (
                    <ServiceCard key={id} {...props} />
                  ))
                )}

                {showApiData && services.length === 0 && (
                  <div className="py-10 text-center text-n300">
                    Aucun service trouvé. Essayez de modifier vos filtres.
                  </div>
                )}
              </div>
            )}

            {pagination && pagination.pages > 1 && (
              <div className="container pt-8">
                <div className="flex items-center justify-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
                        page === pagination.page
                          ? "bg-b300 text-white"
                          : "bg-n20 text-n300 hover:bg-b50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!showApiData && (
              <div className="container pt-8">
                <Pagination />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ServicesPage;
