"use client";

import { useEffect, useState } from "react";
import { PiSliders, PiSpinner } from "react-icons/pi";
import { topExperts } from "../../data/data";
import { useWorkersStore } from "@/stores/workersStore";
import { categoryLabels } from "@/types";
import StaggerEffectTwo from "../animation/StaggerEffectTwo";
import ExpertCard from "../ui/ExpertCard";
import Pagination from "../ui/Pagination";
import WorkersFilterModal from "./WorkersFilterModal";

function WorkersList() {
  const [filterModal, setFilterModal] = useState(false);
  const { workers, pagination, isLoading, error, fetchWorkers, setFilters } = useWorkersStore();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchWorkers().then(() => setHasLoaded(true));
  }, []);

  const handleCityFilter = (city: string) => {
    setSelectedCity(city);
    const filters: Record<string, any> = {};
    if (city) filters.city = city;
    if (selectedCategory) filters.category = selectedCategory;
    setFilters(filters);
    fetchWorkers(filters);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    const filters: Record<string, any> = {};
    if (selectedCity) filters.city = selectedCity;
    if (category) filters.category = category;
    setFilters(filters);
    fetchWorkers(filters);
  };

  const handlePageChange = (page: number) => {
    fetchWorkers({ page });
  };

  // Utiliser les données de l'API si disponibles, sinon les données statiques
  const showApiData = hasLoaded && workers.length > 0;

  return (
    <section className="sbp-30 stp-30">
      <div className="container">
        <h2 className="heading-2 pb-3">
          Découvrez les meilleurs prestataires
        </h2>
        <p className="font-medium text-n300">
          Parcourez et connectez-vous avec les talents qui peuvent donner vie à votre projet
        </p>

        <div className="stp-15 sbp-15 flex items-start justify-start">
          <div className="flex flex-wrap items-center justify-start gap-3 overflow-hidden rounded-lg border border-b50 p-1 min-[380px]:rounded-full">
            <div
              onClick={() => setFilterModal(true)}
              className="flex cursor-pointer items-center justify-start gap-3 rounded-full bg-n30 px-5 py-3 text-start font-medium text-n300"
            >
              <PiSliders />
              <span className="">Filtres</span>
            </div>
            <select
              value={selectedCity}
              onChange={(e) => handleCityFilter(e.target.value)}
              className="cursor-pointer rounded-full bg-n30 px-5 py-3 text-start font-medium text-n300 border-none outline-none"
            >
              <option value="">Toutes les villes</option>
              <option value="Paris">Paris</option>
              <option value="Lyon">Lyon</option>
              <option value="Marseille">Marseille</option>
              <option value="Bordeaux">Bordeaux</option>
              <option value="Toulouse">Toulouse</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="cursor-pointer rounded-full bg-n30 px-5 py-3 text-start font-medium text-n300 border-none outline-none"
            >
              <option value="">Toutes catégories</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {isLoading && !hasLoaded ? (
          <div className="flex items-center justify-center py-20">
            <PiSpinner className="animate-spin text-4xl text-b300" />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6 sbp-15">
            {showApiData ? (
              workers.map((worker, idx) => (
                <div className="md:col-span-6 xl:col-span-4 col-span-12" key={worker._id || worker.id}>
                  <StaggerEffectTwo id={idx}>
                    <ExpertCard worker={worker} />
                  </StaggerEffectTwo>
                </div>
              ))
            ) : (
              topExperts.map(({ id, ...props }, idx) => (
                <div className="md:col-span-6 xl:col-span-4 col-span-12" key={id}>
                  <StaggerEffectTwo id={idx}>
                    <ExpertCard {...props} />
                  </StaggerEffectTwo>
                </div>
              ))
            )}

            {showApiData && workers.length === 0 && (
              <div className="col-span-12 py-10 text-center text-n300">
                Aucun prestataire trouvé. Essayez de modifier vos filtres.
              </div>
            )}
          </div>
        )}

        {pagination && pagination.pages > 1 ? (
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
        ) : (
          <Pagination />
        )}
      </div>

      <WorkersFilterModal
        filterModal={filterModal}
        setFilterModal={setFilterModal}
      />
    </section>
  );
}

export default WorkersList;
