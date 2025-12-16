"use client";
import { useEffect } from "react";
import Link from "next/link";
import {
  PiUsers,
  PiStorefront,
  PiChatCircle,
  PiEnvelopeSimple,
  PiSpinner,
  PiArrowRight,
  PiTrendUp,
  PiChartPie,
} from "react-icons/pi";
import { useAdminStore } from "@/stores/adminStore";
import { categoryLabels, Category } from "@/types";
import Counter from "@/components/ui/NumberCounter2";

function AdminDashboard() {
  const {
    stats,
    listingsByCategory,
    recentUsers,
    recentListings,
    isLoading,
    error,
    fetchStats,
  } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <PiSpinner className="animate-spin text-5xl text-b300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={() => fetchStats()}
          className="mt-4 rounded-xl bg-red-500 px-6 py-2 text-white hover:bg-red-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Utilisateurs",
      value: stats?.totalUsers || 0,
      icon: <PiUsers />,
      bgColor: "bg-b300",
      iconBg: "bg-white",
      iconColor: "text-b300",
      link: "/admin/users",
    },
    {
      title: "Services actifs",
      value: stats?.activeListings || 0,
      icon: <PiStorefront />,
      bgColor: "bg-g300",
      iconBg: "bg-white",
      iconColor: "text-g300",
      link: "/admin/services",
    },
    {
      title: "Services totaux",
      value: stats?.totalListings || 0,
      icon: <PiTrendUp />,
      bgColor: "bg-y300",
      iconBg: "bg-white",
      iconColor: "text-y300",
      link: "/admin/services",
    },
    {
      title: "Conversations",
      value: stats?.totalConversations || 0,
      icon: <PiChatCircle />,
      bgColor: "bg-p1",
      iconBg: "bg-white",
      iconColor: "text-p1",
      link: "#",
    },
    {
      title: "Messages",
      value: stats?.totalMessages || 0,
      icon: <PiEnvelopeSimple />,
      bgColor: "bg-r300",
      iconBg: "bg-white",
      iconColor: "text-r300",
      link: "#",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="heading-3">Dashboard Admin</h2>
          <p className="text-n300">Vue d'ensemble de la plateforme</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat, idx) => (
          <Link
            key={idx}
            href={stat.link}
            className={`rounded-2xl ${stat.bgColor} p-6 transition-transform hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.iconBg} text-2xl ${stat.iconColor}`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-white/80">{stat.title}</p>
              <p className="heading-3 text-white">
                <Counter value={stat.value} />
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Services par catégorie */}
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center gap-3 pb-6">
            <PiChartPie className="text-2xl text-b300" />
            <h3 className="heading-5">Services par catégorie</h3>
          </div>
          {listingsByCategory.length > 0 ? (
            <div className="space-y-4">
              {listingsByCategory.map((cat, idx) => {
                const total = stats?.activeListings || 1;
                const percentage = Math.round((cat.count / total) * 100);
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between pb-2">
                      <span className="font-medium">
                        {categoryLabels[cat._id as Category] || cat._id}
                      </span>
                      <span className="text-sm text-n300">
                        {cat.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-n20">
                      <div
                        className="h-full rounded-full bg-b300 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-n300 py-10">Aucune donnée disponible</p>
          )}
        </div>

        {/* Utilisateurs récents */}
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <PiUsers className="text-2xl text-b300" />
              <h3 className="heading-5">Utilisateurs récents</h3>
            </div>
            <Link
              href="/admin/users"
              className="flex items-center gap-1 text-sm font-medium text-b300 hover:underline"
            >
              Voir tout <PiArrowRight />
            </Link>
          </div>
          {recentUsers.length > 0 ? (
            <div className="space-y-4">
              {recentUsers.map((user, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-n30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-b50 font-semibold text-b300">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-n300">{user.email}</p>
                    </div>
                  </div>
                  <p className="text-xs text-n300">
                    {new Date(user.createdAt || "").toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-n300 py-10">Aucun utilisateur récent</p>
          )}
        </div>
      </div>

      {/* Services récents */}
      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <PiStorefront className="text-2xl text-b300" />
            <h3 className="heading-5">Services récents</h3>
          </div>
          <Link
            href="/admin/services"
            className="flex items-center gap-1 text-sm font-medium text-b300 hover:underline"
          >
            Voir tout <PiArrowRight />
          </Link>
        </div>
        {recentListings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-n30 text-left">
                  <th className="pb-4 font-semibold">Service</th>
                  <th className="pb-4 font-semibold">Propriétaire</th>
                  <th className="pb-4 font-semibold">Catégorie</th>
                  <th className="pb-4 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentListings.map((listing: any, idx) => (
                  <tr key={idx} className="border-b border-n20">
                    <td className="py-4">
                      <p className="font-medium">{listing.title}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-n300">{listing.owner?.name || "N/A"}</p>
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-b50 px-3 py-1 text-sm text-b300">
                        {categoryLabels[listing.category as Category] || listing.category}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          listing.status === "active"
                            ? "bg-g50 text-g400"
                            : listing.status === "pending"
                            ? "bg-y50 text-y600"
                            : "bg-r50 text-r300"
                        }`}
                      >
                        {listing.status === "active"
                          ? "Actif"
                          : listing.status === "pending"
                          ? "En attente"
                          : "Inactif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-n300 py-10">Aucun service récent</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
