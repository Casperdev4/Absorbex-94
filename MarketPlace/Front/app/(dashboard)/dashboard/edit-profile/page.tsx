"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PiSpinner, PiEye, PiEyeSlash, PiCheck } from "react-icons/pi";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/lib/api";
import { categoryLabels, Category } from "@/types";

const allCategories: Category[] = [
  "cleaning",
  "renovation",
  "gardening",
  "handyman",
  "photography",
  "babysitting",
  "moving",
  "tutoring",
  "beauty",
  "tech",
  "events",
  "other",
];

function EditProfile() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, checkAuth, updateUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phone: "",
    bio: "",
    hourlyRate: "",
    skills: [] as string[],
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/sign-in?redirect=/dashboard/edit-profile");
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        city: user.city || "",
        phone: user.phone || "",
        bio: user.bio || "",
        hourlyRate: user.hourlyRate?.toString() || "",
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const updateData: any = {
        name: formData.name,
        city: formData.city,
        phone: formData.phone,
        bio: formData.bio,
      };

      if (user?.role === "worker") {
        updateData.hourlyRate = formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined;
        updateData.skills = formData.skills;
      }

      const response = await authApi.updateProfile(updateData);
      if (response.data.success) {
        updateUser(response.data.data);
        setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Erreur lors de la mise à jour du profil",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Les mots de passe ne correspondent pas" });
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Le mot de passe doit contenir au moins 6 caractères" });
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await authApi.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (response.data.success) {
        setPasswordMessage({ type: "success", text: "Mot de passe mis à jour avec succès !" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error: any) {
      setPasswordMessage({
        type: "error",
        text: error.response?.data?.message || "Erreur lors de la mise à jour du mot de passe",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading) {
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
    <>
      <section className="mt-[100px] pt-15">
        <form onSubmit={handleProfileSubmit}>
          <div className="4xl:large-container grid grid-cols-12 gap-4 rounded-2xl bg-white p-4 max-4xl:mx-4 sm:gap-6 sm:p-10">
            <div className="col-span-12 flex items-center justify-between gap-4">
              <h4 className="heading-4">Modifier les informations du profil</h4>
            </div>

            {/* Avatar */}
            <div className="col-span-12 flex items-center justify-start gap-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-b300 flex items-center justify-center text-white text-3xl font-bold">
                  {user.name?.charAt(0) || "?"}
                </div>
              )}
              <div>
                <label
                  className="cursor-pointer rounded-xl bg-n900 px-5 py-2 text-white hover:bg-n800"
                  htmlFor="profilePic"
                >
                  Changer
                </label>
                <input
                  type="file"
                  className="hidden rounded-lg"
                  id="profilePic"
                  accept="image/*"
                />
                <p className="text-sm text-n300 mt-2">JPG, PNG. Max 2 Mo</p>
              </div>
            </div>

            <div className="col-span-12 sm:col-span-6">
              <p className="pb-3 font-medium text-n100">Nom :</p>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Votre nom"
                className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none focus:border-b300"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <p className="pb-3 font-medium text-n100">Ville :</p>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Votre ville"
                className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none focus:border-b300"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <p className="pb-3 font-medium text-n100">Email :</p>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-xl border border-b50 bg-n20 p-3 outline-none text-n300 cursor-not-allowed"
              />
              <p className="text-xs text-n300 mt-1">L'email ne peut pas être modifié</p>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <p className="pb-3 font-medium text-n100">Téléphone :</p>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+33 6 12 34 56 78"
                className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none focus:border-b300"
              />
            </div>

            {/* Champs spécifiques aux prestataires */}
            {user.role === "worker" && (
              <>
                <div className="col-span-12 sm:col-span-6">
                  <p className="pb-3 font-medium text-n100">Taux horaire (€/h) :</p>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="25"
                    min="0"
                    className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none focus:border-b300"
                  />
                </div>
                <div className="col-span-12">
                  <p className="pb-3 font-medium text-n100">Compétences :</p>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleSkillToggle(category)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          formData.skills.includes(category)
                            ? "bg-b300 text-white"
                            : "bg-b50 text-b300 hover:bg-b100"
                        }`}
                      >
                        {formData.skills.includes(category) && <PiCheck />}
                        {categoryLabels[category]}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="col-span-12">
              <p className="pb-3 font-medium text-n100">À propos :</p>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Décrivez-vous en quelques mots..."
                className="min-h-40 w-full rounded-xl border border-b50 bg-n10 p-3 outline-none focus:border-b300"
              ></textarea>
            </div>

            {message.text && (
              <div
                className={`col-span-12 p-4 rounded-xl ${
                  message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="col-span-12">
              <button
                type="submit"
                disabled={isLoading}
                className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8 disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading && <PiSpinner className="animate-spin" />}
                  Enregistrer les modifications
                </span>
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Section mot de passe */}
      <section className="pt-6 sm:pt-10">
        <form onSubmit={handlePasswordSubmit}>
          <div className="4xl:large-container grid grid-cols-12 gap-4 rounded-2xl bg-white p-4 max-4xl:mx-4 sm:gap-6 sm:p-10">
            <div className="col-span-12 border-b border-n30 pb-6">
              <h5 className="heading-5">Modifier le mot de passe</h5>
            </div>
            <div className="col-span-12">
              <p className="pb-3 font-medium text-n100">Mot de passe actuel *</p>
              <div className="relative flex items-center justify-between rounded-xl border border-b50 bg-n10 p-3">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                  }
                  placeholder="Entrez votre mot de passe actuel"
                  className="w-full bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                  }
                  className="text-xl text-n300"
                >
                  {showPasswords.current ? <PiEyeSlash /> : <PiEye />}
                </button>
              </div>
            </div>
            <div className="col-span-12">
              <p className="pb-3 font-medium text-n100">Nouveau mot de passe *</p>
              <div className="relative flex items-center justify-between rounded-xl border border-b50 bg-n10 p-3">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  placeholder="Entrez votre nouveau mot de passe"
                  className="w-full bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                  className="text-xl text-n300"
                >
                  {showPasswords.new ? <PiEyeSlash /> : <PiEye />}
                </button>
              </div>
            </div>
            <div className="col-span-12">
              <p className="pb-3 font-medium text-n100">Confirmer le nouveau mot de passe *</p>
              <div className="relative flex items-center justify-between rounded-xl border border-b50 bg-n10 p-3">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  placeholder="Confirmez votre nouveau mot de passe"
                  className="w-full bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                  }
                  className="text-xl text-n300"
                >
                  {showPasswords.confirm ? <PiEyeSlash /> : <PiEye />}
                </button>
              </div>
            </div>

            {passwordMessage.text && (
              <div
                className={`col-span-12 p-4 rounded-xl ${
                  passwordMessage.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <div className="col-span-12">
              <button
                type="submit"
                disabled={passwordLoading}
                className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8 disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {passwordLoading && <PiSpinner className="animate-spin" />}
                  Modifier le mot de passe
                </span>
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default EditProfile;
