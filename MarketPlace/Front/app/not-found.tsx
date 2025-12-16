import Link from "next/link";

function NotFoundPage() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="heading-1 text-n900">404</h1>
      <p className="pt-4 text-xl text-n500">Page non trouvée</p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-b300 px-8 py-3 font-semibold text-white duration-300 hover:bg-b400"
      >
        Retour à l'accueil
      </Link>
    </section>
  );
}

export default NotFoundPage;
