export default function HowItWorks() {
  return (
    <section className="stp-30 sbp-30 container mb-12">
      <div className="flex w-full flex-col items-center justify-center text-center">
        <h5 className="pb-4 font-bold text-r300">Comment ça marche</h5>
        <h2 className="heading-2 font-bold text-n900">
          Notre <span className="text-b300 underline">processus</span>
        </h2>
      </div>
      <div className="stp-15 grid grid-cols-12 gap-4 sm:gap-6">
        <div className="relative col-span-12 sm:col-span-6 md:col-span-4">
          <div className="relative z-10 flex flex-col items-start justify-start gap-8 rounded-xl border border-r100 bg-r50 px-4 py-8 lg:gap-14 lg:px-12 lg:py-16">
            <p className="heading-4 flex size-[72px] items-center justify-center rounded-full bg-r300 p-6 !leading-none">
              01
            </p>
            <h3 className="heading-3 font-bold">Évaluez les prestataires</h3>
            <p className="font-medium">
              Choisissez un prestataire selon le prix, les compétences et les avis.
            </p>
          </div>
          <div className="absolute -bottom-6 left-4 right-4 -z-10 h-[82px] rounded-xl border border-r100/60 bg-r50/30"></div>
        </div>
        <div className="relative col-span-12 -mb-8 mt-8 sm:col-span-6 md:col-span-4">
          <div className="flex h-full flex-col items-start justify-start gap-8 rounded-xl border border-o300 bg-y50 px-4 py-8 lg:gap-14 lg:px-12 lg:py-16">
            <p className="heading-4 flex size-[72px] items-center justify-center rounded-full bg-y300 !leading-none">
              02
            </p>
            <h3 className="heading-3 font-bold">Réservez maintenant</h3>
            <p className="font-medium">Planifiez un prestataire dès aujourd'hui</p>
          </div>
          <div className="absolute -bottom-6 left-4 right-4 -z-10 h-[82px] rounded-xl border border-y300/60 bg-y50/30"></div>
        </div>

        <div className="relative col-span-12 sm:col-span-6 md:col-span-4">
          <div className="flex flex-col items-start justify-start gap-8 rounded-xl border border-eb200 bg-eb50 px-4 py-8 max-md:mt-6 max-sm:mt-16 lg:gap-14 lg:px-12 lg:py-16">
            <p className="heading-4 flex size-[72px] items-center justify-center rounded-full bg-g200 p-6 !leading-none">
              03
            </p>
            <h3 className="heading-3 font-bold">Messagerie intégrée</h3>
            <p className="font-medium">
              Discutez, payez et laissez un avis facilement au même endroit.
            </p>
          </div>
          <div className="absolute -bottom-6 left-4 right-4 -z-10 h-[82px] rounded-xl border border-eb200/60 bg-eb50/30"></div>
        </div>
      </div>
    </section>
  );
}
