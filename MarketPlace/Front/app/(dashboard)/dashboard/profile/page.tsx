"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PiPencilSimpleLine, PiSpinner } from "react-icons/pi";
import { useAuthStore } from "@/stores/authStore";
import { categoryLabels, Category } from "@/types";

function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/sign-in?redirect=/dashboard/profile");
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <section className="mt-[100px] pt-15 flex items-center justify-center">
        <PiSpinner className="animate-spin text-4xl text-b300" />
      </section>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="mt-[100px] pt-15">
      <div className="4xl:large-container grid grid-cols-12 gap-4 rounded-2xl bg-white p-4 max-4xl:mx-4 sm:gap-6 sm:p-10">
        <div className="col-span-12 flex items-center justify-between gap-4">
          <h4 className="heading-4">Informations du profil</h4>
          <Link
            href={"/dashboard/edit-profile"}
            className="flex items-center justify-start gap-3 text-lg font-medium text-b300"
          >
            <span className="text-2xl">
              <PiPencilSimpleLine />
            </span>
            Modifier le profil
          </Link>
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="pb-3 font-medium text-n100">Nom :</p>
          <div className="w-full rounded-xl border border-b50 bg-n10 p-3 text-n800">
            {user.name || "Non renseigné"}
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="pb-3 font-medium text-n100">Ville :</p>
          <div className="w-full rounded-xl border border-b50 bg-n10 p-3 text-n800">
            {user.city || "Non renseigné"}
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="pb-3 font-medium text-n100">Email :</p>
          <div className="w-full rounded-xl border border-b50 bg-n10 p-3 text-n800">
            {user.email}
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="pb-3 font-medium text-n100">Téléphone :</p>
          <div className="w-full rounded-xl border border-b50 bg-n10 p-3 text-n800">
            {user.phone || "Non renseigné"}
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="pb-3 font-medium text-n100">Rôle :</p>
          <div className="w-full rounded-xl border border-b50 bg-n10 p-3 text-n800">
            {user.role === "worker" ? "Prestataire" : user.role === "admin" ? "Administrateur" : "Utilisateur"}
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="pb-3 font-medium text-n100">Membre depuis :</p>
          <div className="w-full rounded-xl border border-b50 bg-n10 p-3 text-n800">
            {new Date(user.createdAt).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {user.role === "worker" && (
          <>
            <div className="col-span-12 sm:col-span-6">
              <p className="pb-3 font-medium text-n100">Taux horaire :</p>
              <div className="w-full rounded-xl border border-b50 bg-n10 p-3 text-n800">
                {user.hourlyRate ? `${user.hourlyRate}€/h` : "Non renseigné"}
              </div>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <p className="pb-3 font-medium text-n100">Note moyenne :</p>
              <div className="w-full rounded-xl border border-b50 bg-n10 p-3 text-n800">
                {user.rating ? `${user.rating.toFixed(1)}/5 (${user.reviewCount || 0} avis)` : "Pas encore noté"}
              </div>
            </div>
            <div className="col-span-12">
              <p className="pb-3 font-medium text-n100">Compétences :</p>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-b50 px-4 py-2 text-sm font-medium text-b300"
                    >
                      {categoryLabels[skill as Category] || skill}
                    </span>
                  ))
                ) : (
                  <span className="text-n300">Aucune compétence renseignée</span>
                )}
              </div>
            </div>
          </>
        )}

        <div className="col-span-12">
          <p className="pb-3 font-medium text-n100">À propos :</p>
          <div className="min-h-20 w-full rounded-xl border border-b50 bg-n10 p-3 text-n800 whitespace-pre-line">
            {user.bio || "Aucune description renseignée"}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
