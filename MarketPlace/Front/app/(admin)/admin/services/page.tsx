"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PiMagnifyingGlass,
  PiSpinner,
  PiStorefront,
  PiTrash,
  PiEye,
  PiCaretLeft,
  PiCaretRight,
  PiCheckCircle,
  PiXCircle,
  PiClock,
  PiWarning,
} from "react-icons/pi";
import { useAdminStore } from "@/stores/adminStore";
import { categoryLabels, Category } from "@/types";

function AdminServicesPage() {
  const {
    services,
    servicesPagination,
    isLoading,
    error,
    fetchServices,
    updateServiceStatus,
    deleteService,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices({
      search: searchQuery,
      status: statusFilter,
      category: categoryFilter,
      page: 1,
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") setStatusFilter(value);
    if (key === "category") setCategoryFilter(value);

    fetchServices({
      search: searchQuery,
      status: key === "status" ? value : statusFilter,
      category: key === "category" ? value : categoryFilter,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    fetchServices({
      search: searchQuery,
      status: statusFilter,
      category: categoryFilter,
      page,
    });
  };

  const handleStatusChange = async (serviceId: string, newStatus: string) => {
    setActionLoading(serviceId);
    try {
      await updateServiceStatus(serviceId, newStatus);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (serviceId: string) => {
    setActionLoading(serviceId);
    try {
      await deleteService(serviceId);
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="flex items-center gap-1 rounded-full bg-g50 px-3 py-1 text-xs font-medium text-g400">
            <PiCheckCircle /> Actif
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 rounded-full bg-y50 px-3 py-1 text-xs font-medium text-y600">
            <PiClock /> En attente
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 rounded-full bg-r50 px-3 py-1 text-xs font-medium text-r300">
            <PiXCircle /> Rejeté
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 rounded-full bg-n20 px-3 py-1 text-xs font-medium text-n500">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="heading-3">Gestion des services</h2>
          <p className="text-n300">
            {servicesPagination?.total || 0} services au total
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="rounded-xl border border-n30 bg-white px-4 py-2 outline-none"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="pending">En attente</option>
            <option value="rejected">Rejetés</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="rounded-xl border border-n30 bg-white px-4 py-2 outline-none"
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

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-2 border border-n30">
          <PiMagnifyingGlass className="text-n300" />
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-b300 px-6 py-2 font-medium text-white hover:bg-b400"
        >
          Rechercher
        </button>
      </form>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-500">{error}</div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6">
            <div className="flex items-center gap-3 text-r300">
              <PiWarning className="text-3xl" />
              <h3 className="heading-5">Confirmer la suppression</h3>
            </div>
            <p className="mt-4 text-n500">
              Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-xl border border-n30 px-4 py-2 font-medium hover:bg-n20"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading === deleteConfirm}
                className="flex-1 rounded-xl bg-r300 px-4 py-2 font-medium text-white hover:bg-r400 disabled:opacity-50"
              >
                {actionLoading === deleteConfirm ? (
                  <PiSpinner className="mx-auto animate-spin" />
                ) : (
                  "Supprimer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="overflow-hidden rounded-2xl bg-white">
        {isLoading && services.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <PiSpinner className="animate-spin text-4xl text-b300" />
          </div>
        ) : services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-n30 bg-n10">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Service</th>
                  <th className="px-6 py-4 text-left font-semibold">Propriétaire</th>
                  <th className="px-6 py-4 text-left font-semibold">Catégorie</th>
                  <th className="px-6 py-4 text-left font-semibold">Prix</th>
                  <th className="px-6 py-4 text-left font-semibold">Statut</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service: any) => (
                  <tr
                    key={service._id}
                    className="border-b border-n20 hover:bg-n10"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {service.images?.[0] ? (
                          <img
                            src={service.images[0]}
                            alt={service.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-n20 text-xl text-n300">
                            <PiStorefront />
                          </div>
                        )}
                        <div>
                          <p className="font-medium line-clamp-1">{service.title}</p>
                          <p className="text-xs text-n300">{service.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-n500">{service.owner?.name || "N/A"}</p>
                      <p className="text-xs text-n300">{service.owner?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-b50 px-3 py-1 text-sm text-b300">
                        {categoryLabels[service.category as Category] || service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-b300">
                        {service.price}€
                        {service.priceType === "hourly" && "/h"}
                      </p>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(service.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={service.status}
                          onChange={(e) => handleStatusChange(service._id, e.target.value)}
                          disabled={actionLoading === service._id}
                          className="rounded-lg border border-n30 bg-white px-2 py-1 text-sm outline-none focus:border-b300 disabled:opacity-50"
                        >
                          <option value="active">Actif</option>
                          <option value="pending">En attente</option>
                          <option value="rejected">Rejeté</option>
                        </select>
                        <Link
                          href={`/services/service-details?id=${service._id}`}
                          target="_blank"
                          className="rounded-lg bg-b50 p-2 text-b300 hover:bg-b100"
                        >
                          <PiEye />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(service._id)}
                          className="rounded-lg bg-r50 p-2 text-r300 hover:bg-r100"
                        >
                          <PiTrash />
                        </button>
                        {actionLoading === service._id && (
                          <PiSpinner className="animate-spin text-b300" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-n300">
            <PiStorefront className="mx-auto text-6xl text-n200" />
            <p className="mt-4">Aucun service trouvé</p>
          </div>
        )}

        {/* Pagination */}
        {servicesPagination && servicesPagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-n30 px-6 py-4">
            <p className="text-sm text-n300">
              Page {servicesPagination.page} sur {servicesPagination.pages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(servicesPagination.page - 1)}
                disabled={servicesPagination.page <= 1}
                className="flex items-center gap-1 rounded-lg border border-n30 px-3 py-2 text-sm font-medium hover:bg-n20 disabled:opacity-50"
              >
                <PiCaretLeft /> Précédent
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, servicesPagination.pages) }, (_, i) => {
                  let pageNum;
                  if (servicesPagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (servicesPagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (servicesPagination.page >= servicesPagination.pages - 2) {
                    pageNum = servicesPagination.pages - 4 + i;
                  } else {
                    pageNum = servicesPagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-10 w-10 rounded-lg text-sm font-medium ${
                        pageNum === servicesPagination.page
                          ? "bg-b300 text-white"
                          : "border border-n30 hover:bg-n20"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(servicesPagination.page + 1)}
                disabled={servicesPagination.page >= servicesPagination.pages}
                className="flex items-center gap-1 rounded-lg border border-n30 px-3 py-2 text-sm font-medium hover:bg-n20 disabled:opacity-50"
              >
                Suivant <PiCaretRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminServicesPage;
