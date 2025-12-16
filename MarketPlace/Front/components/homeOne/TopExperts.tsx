import { PiArrowRightBold } from "react-icons/pi";
import { topExperts } from "../../data/data";
import StaggerEffectTwo from "../animation/StaggerEffectTwo";
import Link from "next/link";
import ExpertCard from "../ui/ExpertCard";

function TopExperts({
  isBgGray,
  isThree,
}: {
  isBgGray?: boolean;
  isThree?: boolean;
}) {
  return (
    <section className={`stp-30 sbp-30 ${isBgGray ? "bg-n20" : ""}`}>
      <div className="container">
        <div className="flex items-center justify-between gap-2">
          <div className="flex max-w-[300px] flex-col">
            <h2 className="heading-2 font-bold text-n900">
              Nos <span className="text-b300 underline">Experts</span>
            </h2>
            <p className="pt-4 font-medium text-n500">
              Nos prestataires qualifiés et fiables, vos partenaires de confiance.
            </p>
          </div>
          <div className="">
            <Link
              href="/find-workers"
              className="flex items-center justify-start gap-3 font-bold duration-300 hover:text-b300"
            >
              Tous les experts
              <PiArrowRightBold className="text-2xl !leading-none" />
            </Link>
          </div>
        </div>

        <div className="stp-15 grid grid-cols-12 gap-6">
          {topExperts.slice(0, isThree ? 3 : 6).map(({ id, ...props }, idx) => (
            <div className="md:col-span-6 xl:col-span-4 col-span-12" key={id}>
              <StaggerEffectTwo id={idx}>
                <ExpertCard {...props} />
              </StaggerEffectTwo>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopExperts;
