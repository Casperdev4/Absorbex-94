"use client";
import LeftSideSlider from "@/components/authentication/LeftSideSlider";
import facebook from "@/public/images/facebook_icon.png";
import google from "@/public/images/google_icon.png";
import logo from "@/public/images/logo.png";
import icon2 from "@/public/images/victor_icon.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  PiBriefcase,
  PiEnvelopeSimple,
  PiImage,
  PiLock,
  PiMapPin,
  PiSpinner,
  PiUser,
} from "react-icons/pi";
import { useAuthStore } from "@/stores/authStore";

function SignUpPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [loginStep, setLoginStep] = useState(1);
  const [error, setError] = useState("");

  // Formulaire data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isWorker: false,
    companyName: "",
    jobTitle: "",
    city: "",
  });

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    setError("");

    if (loginStep === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError("Veuillez remplir tous les champs");
        return;
      }
      if (formData.password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
    }

    setLoginStep(loginStep + 1);
  };

  const handleSubmit = async () => {
    setError("");

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        city: formData.city,
        role: formData.isWorker ? "worker" : "user",
      });
      router.push("/dashboard/home");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute -bottom-40 rtl:-right-20 ltr:-left-20 size-[550px] rounded-full bg-eb100/20 max-lg:hidden"></div>

        <div className="absolute -top-40 rtl:right-32 ltr:left-32 h-[600px] w-[550px] rounded-full bg-r50/30 max-lg:hidden"></div>

        <div className="absolute -bottom-60 rtl:-left-40 ltr:-right-40 -z-10 size-[500px] rounded-full bg-eb50/20 max-lg:hidden"></div>

        <div className="flex h-full items-center justify-start max-lg:justify-center">
          <LeftSideSlider />
          <div className="flex h-full w-full max-w-[530px] flex-col items-start justify-start max-lg:px-6 max-lg:pt-40 max-sm:pt-32 lg:ml-20 xl:max-w-[380px] xxl:max-w-[530px] 3xl:ml-40">
            <div className="">
              <Link href="/">
                <Image src={logo} alt="" />
              </Link>
            </div>
            {loginStep === 1 && (
              <>
                <div className="flex items-center justify-start pt-8">
                  <p className="heading-5">Bienvenue sur Servibe</p>
                  <Image src={icon2} alt="" />
                </div>
                <form className="flex w-full flex-col pt-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                      <span className="text-2xl !leading-none">
                        <PiUser />
                      </span>
                      <input
                        type="text"
                        placeholder="Entrez votre nom"
                        className="w-full text-sm text-n300 outline-none"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                      <span className=" text-2xl !leading-none">
                        <PiEnvelopeSimple />
                      </span>
                      <input
                        type="email"
                        placeholder="Entrez votre email"
                        className="w-full text-sm text-n300 outline-none"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                      <span className="text-2xl !leading-none">
                        <PiLock />
                      </span>
                      <input
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        className="w-full text-sm text-n300 outline-none"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </form>
              </>
            )}

            {loginStep === 2 && (
              <>
                <div className="flex items-center justify-start pt-8">
                  <p className="heading-5">Type de compte</p>
                  <Image src={icon2} alt="" />
                </div>

                <form className="flex w-full flex-col pt-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                      <span className="text-2xl !leading-none">
                        <PiUser />
                      </span>
                      <input
                        type="text"
                        placeholder="Nom de l'entreprise (optionnel)"
                        className="w-full text-sm text-n300 outline-none"
                        value={formData.companyName}
                        onChange={(e) => updateFormData("companyName", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex items-center justify-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.isWorker}
                        onChange={(e) => updateFormData("isWorker", e.target.checked)}
                        disabled={isLoading}
                      />
                      <p className="text-sm text-n300">
                        Je souhaite proposer mes services (prestataire)
                      </p>
                    </div>
                  </div>
                </form>
              </>
            )}

            {loginStep === 3 && (
              <form className="flex w-full flex-col pt-6">
                <div className="flex items-center justify-start pb-6">
                  <p className="heading-5">Finaliser votre profil</p>
                  <Image src={icon2} alt="" />
                </div>
                <div className="flex flex-col gap-6">
                  {formData.isWorker && (
                    <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                      <span className="text-2xl !leading-none">
                        <PiBriefcase />
                      </span>
                      <input
                        type="text"
                        placeholder="Titre professionnel"
                        className="w-full text-sm text-n300 outline-none"
                        value={formData.jobTitle}
                        onChange={(e) => updateFormData("jobTitle", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                    <span className=" text-2xl !leading-none">
                      <PiMapPin />
                    </span>
                    <input
                      type="text"
                      placeholder="Ville"
                      className="w-full text-sm text-n300 outline-none"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="">
                    <p className="pb-3 text-sm text-n300">
                      Ajoutez une photo pour créer un lien de confiance.
                    </p>
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-b50 bg-n10 px-3 py-10 cursor-pointer hover:bg-n20 transition-colors">
                      <span className="text-6xl !leading-none">
                        <PiImage />
                      </span>
                      <p className="pt-3 text-sm font-medium">
                        Télécharger une photo de profil
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {error && (
              <p className="mt-3 text-sm text-red-500">{error}</p>
            )}

            <div className="w-full">
              {loginStep > 1 && (
                <button
                  onClick={() => setLoginStep(loginStep - 1)}
                  className="block py-3 text-start text-sm font-medium text-n300 hover:text-b300"
                  disabled={isLoading}
                >
                  Retour
                </button>
              )}
              {loginStep === 1 && (
                <Link
                  href="/contact"
                  className="block py-3 text-end text-sm font-medium text-n300"
                >
                  Mot de passe oublié ?
                </Link>
              )}
              {loginStep < 3 && (
                <button
                  onClick={handleContinue}
                  disabled={isLoading}
                  className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8 disabled:opacity-50"
                >
                  <span className="relative z-10">Continuer</span>
                </button>
              )}
              {loginStep === 3 && (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8 disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading && <PiSpinner className="animate-spin" />}
                    Créer mon compte
                  </span>
                </button>
              )}

              {loginStep === 1 && (
                <>
                  <div className="flex items-center justify-center gap-2 py-3 text-sm font-medium">
                    <p className="text-n300">Vous avez déjà un compte ?</p>
                    <Link href="/sign-in" className="text-b300 underline">
                      Connectez-vous
                    </Link>
                  </div>

                  <button
                    type="button"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-n30 bg-white py-3"
                  >
                    <Image src={google} alt="" />
                    <span className="text-sm">Google</span>
                  </button>

                  <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-n30 bg-white py-3"
                  >
                    <Image src={facebook} alt="" />
                    <span className="text-sm">Facebook</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignUpPage;
