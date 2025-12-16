"use client";
// Import Swiper styles
import "swiper/css";
// Import Swiper React components

import LeftSideSlider from "@/components/authentication/LeftSideSlider";
import facebook from "@/public/images/facebook_icon.png";
import google from "@/public/images/google_icon.png";
import logo from "@/public/images/logo.png";
import icon2 from "@/public/images/victor_icon.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PiEnvelopeSimple, PiLock, PiSpinner } from "react-icons/pi";
import { useAuthStore } from "@/stores/authStore";

function SignInPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      await login(email, password);
      router.push("/dashboard/home");
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
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
          <div className="flex h-full w-full max-w-[530px] flex-col items-start justify-start max-lg:px-6 max-lg:pt-40 lg:ml-20 xl:max-w-[380px] xxl:max-w-[530px] 3xl:ml-40">
            <div className="">
              <Link href="/">
                <Image src={logo} alt="" />
              </Link>
            </div>
            <div className="flex items-center justify-start pt-8">
              <p className="heading-5">Bienvenue sur Servibe</p>
              <Image src={icon2} alt="" />
            </div>
            <form onSubmit={handleSubmit} className="flex w-full flex-col pt-6">
              <div className="flex flex-col gap-6">
                <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                  <span className=" text-2xl !leading-none">
                    <PiEnvelopeSimple />
                  </span>
                  <input
                    type="email"
                    placeholder="Entrez votre email"
                    className="w-full text-sm text-n300 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                  <span className=" text-2xl !leading-none">
                    <PiLock />
                  </span>
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    className="w-full text-sm text-n300 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <p className="mt-3 text-sm text-red-500">{error}</p>
              )}

              <div className="w-full">
                <Link
                  href="/contact"
                  className="block py-3 text-end text-sm font-medium text-n300"
                >
                  Mot de passe oublié ?
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8 disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading && <PiSpinner className="animate-spin" />}
                    Se connecter
                  </span>
                </button>
                <div className="flex items-center justify-center gap-2 py-3 text-sm font-medium">
                  <p className="text-n300">Pas encore de compte ?</p>
                  <Link href="/sign-up" className="text-b300 underline">
                    Créer un compte
                  </Link>
                </div>

                <button
                  type="button"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-n30 py-3"
                >
                  <Image src={google} alt="" />
                  <span className="text-sm">Google</span>
                </button>

                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-n30 py-3"
                >
                  <Image src={facebook} alt="" />
                  <span className="text-sm">Facebook</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignInPage;
