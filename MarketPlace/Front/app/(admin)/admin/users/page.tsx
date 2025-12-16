"use client";
import { useEffect, useState } from "react";
import {
  PiMagnifyingGlass,
  PiSpinner,
  PiUserCircle,
  PiShieldCheck,
  PiUser,
  PiBriefcase,
  PiCaretLeft,
  PiCaretRight,
} from "react-icons/pi";
import { useAdminStore } from "@/stores/adminStore";

function AdminUsersPage() {
  const {
    users,
    usersPagination,
    isLoading,
    error,
    fetchUsers,
    updateUserRole,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleChanging, setRoleChanging] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers({ search: searchQuery, page: 1 });
  };

  const handlePageChange = (page: number) => {
    fetchUsers({ search: searchQuery, page });
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setRoleChanging(userId);
    try {
      await updateUserRole(userId, newRole);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setRoleChanging(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="flex items-center gap-1 rounded-full bg-r50 px-3 py-1 text-xs font-medium text-r300">
            <PiShieldCheck /> Admin
          </span>
        );
      case "worker":
        return (
          <span className="flex items-center gap-1 rounded-full bg-b50 px-3 py-1 text-xs font-medium text-b300">
            <PiBriefcase /> Prestataire
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 rounded-full bg-n20 px-3 py-1 text-xs font-medium text-n500">
            <PiUser /> Utilisateur
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="heading-3">Gestion des utilisateurs</h2>
          <p className="text-n300">
            {usersPagination?.total || 0} utilisateurs au total
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 border border-n30">
            <PiMagnifyingGlass className="text-n300" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none sm:w-64"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-b300 px-6 py-2 font-medium text-white hover:bg-b400"
          >
            Rechercher
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-500">{error}</div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl bg-white">
        {isLoading && users.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <PiSpinner className="animate-spin text-4xl text-b300" />
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-n30 bg-n10">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Utilisateur</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Ville</th>
                  <th className="px-6 py-4 text-left font-semibold">Rôle</th>
                  <th className="px-6 py-4 text-left font-semibold">Inscrit le</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id || user.id}
                    className="border-b border-n20 hover:bg-n10"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-b50 text-xl text-b300">
                            <PiUserCircle />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user.name}</p>
                          {user.phone && (
                            <p className="text-xs text-n300">{user.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-n500">{user.email}</td>
                    <td className="px-6 py-4 text-n500">{user.city || "-"}</td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4 text-n300 text-sm">
                      {new Date(user.createdAt || "").toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id || user.id || "", e.target.value)
                        }
                        disabled={roleChanging === (user._id || user.id)}
                        className="rounded-lg border border-n30 bg-white px-3 py-2 text-sm outline-none focus:border-b300 disabled:opacity-50"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="worker">Prestataire</option>
                        <option value="admin">Admin</option>
                      </select>
                      {roleChanging === (user._id || user.id) && (
                        <PiSpinner className="ml-2 inline animate-spin text-b300" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-n300">
            <PiUserCircle className="mx-auto text-6xl text-n200" />
            <p className="mt-4">Aucun utilisateur trouvé</p>
          </div>
        )}

        {/* Pagination */}
        {usersPagination && usersPagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-n30 px-6 py-4">
            <p className="text-sm text-n300">
              Page {usersPagination.page} sur {usersPagination.pages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(usersPagination.page - 1)}
                disabled={usersPagination.page <= 1}
                className="flex items-center gap-1 rounded-lg border border-n30 px-3 py-2 text-sm font-medium hover:bg-n20 disabled:opacity-50"
              >
                <PiCaretLeft /> Précédent
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, usersPagination.pages) }, (_, i) => {
                  let pageNum;
                  if (usersPagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (usersPagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (usersPagination.page >= usersPagination.pages - 2) {
                    pageNum = usersPagination.pages - 4 + i;
                  } else {
                    pageNum = usersPagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-10 w-10 rounded-lg text-sm font-medium ${
                        pageNum === usersPagination.page
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
                onClick={() => handlePageChange(usersPagination.page + 1)}
                disabled={usersPagination.page >= usersPagination.pages}
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

export default AdminUsersPage;
