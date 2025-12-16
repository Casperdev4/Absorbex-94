"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  PiChartBar,
  PiUsers,
  PiStorefront,
  PiSignOut,
  PiList,
  PiX,
  PiHouse,
  PiGear,
  PiSpinner,
} from "react-icons/pi";
import { useAuthStore } from "@/stores/authStore";
import logo from "@/public/images/logo.png";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/sign-in?redirect=/admin");
    } else if (!isLoading && isAuthenticated && user?.role !== "admin") {
      router.push("/dashboard/home");
    }
  }, [isLoading, isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-n10">
        <PiSpinner className="animate-spin text-5xl text-b300" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const menuItems = [
    { href: "/admin", icon: <PiChartBar />, label: "Dashboard" },
    { href: "/admin/users", icon: <PiUsers />, label: "Utilisateurs" },
    { href: "/admin/services", icon: <PiStorefront />, label: "Services" },
  ];

  return (
    <div className="flex h-screen bg-n10">
      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-n30 px-6 py-4">
            <Link href="/admin" className="flex items-center gap-2">
              <Image src={logo} alt="Servibe" className="h-10 w-auto" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-2xl text-n300 lg:hidden"
            >
              <PiX />
            </button>
          </div>

          {/* Admin badge */}
          <div className="border-b border-n30 px-6 py-4">
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-r300 font-bold text-white">
                  {user?.name?.charAt(0) || "A"}
                </div>
              )}
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-r300 font-medium">Administrateur</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-n500 transition-colors hover:bg-b50 hover:text-b300"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="border-t border-n30 p-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-n500 transition-colors hover:bg-n20"
            >
              <span className="text-xl">
                <PiHouse />
              </span>
              Retour au site
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-r300 transition-colors hover:bg-r50"
            >
              <span className="text-xl">
                <PiSignOut />
              </span>
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-n30 bg-white px-4 py-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-n500 lg:hidden"
          >
            <PiList />
          </button>
          <h1 className="text-xl font-semibold text-n700">
            Administration
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/home"
              className="text-sm font-medium text-b300 hover:underline"
            >
              Mon Dashboard
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
