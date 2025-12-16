"use client";
import FadeDown from "../animation/FadeDown";
import FadeLeft from "../animation/FadeLeft";
import FadeRight from "../animation/FadeRight";
import FadeTop from "../animation/FadeTop";
import LinkButton from "../ui/LinkButton";

function GetWorkersGigs({ isHeadingBig }: { isHeadingBig?: boolean }) {
  return (
    <section className="stp-30 sbp-30 relative">
      <div className="absolute left-0 top-0 w-full bg-g300 max-sm:h-1/2 sm:bottom-0 sm:w-1/2"></div>
      <div className="absolute bottom-0 right-0 w-full bg-v300 max-sm:h-1/2 sm:top-0 sm:w-1/2"></div>
      <div className="container relative z-10 grid grid-cols-12 text-white max-xxl:overflow-hidden max-sm:gap-6">
        <div className="col-span-12 flex flex-col items-start sm:col-span-5 max-xl:overflow-hidden">
          <FadeDown>
            <h3 className={`${isHeadingBig ? "display-4" : "heading-3"}`}>
              TROUVER DES PRESTATAIRES
            </h3>
          </FadeDown>
          <FadeLeft>
            <p className="pb-6 pt-4 sm:pb-10 sm:pt-6">
              Servibe vous offre un moyen rapide, simple et fiable de trouver
              des prestataires qualifiés à moindre coût et sans délai.
            </p>
          </FadeLeft>
          <FadeTop>
            <div className="text-n800">
              <LinkButton
                link="/find-workers"
                text="Explorer"
                isBgWhite={true}
              />
            </div>
          </FadeTop>
        </div>

        <div className="col-span-12 flex flex-col items-start max-sm:pt-6 sm:col-span-5 sm:col-start-8 max-xl:overflow-hidden">
          <FadeDown>
            <h3 className={`${isHeadingBig ? "display-4" : "heading-3"}`}>
              TROUVER DES MISSIONS
            </h3>
          </FadeDown>
          <FadeRight>
            <p className="pb-6 pt-4 sm:pb-10 sm:pt-6">
              Travaillez selon vos conditions. Servibe vous donne la liberté
              de trouver les missions qui vous correspondent le mieux.
            </p>
          </FadeRight>
          <FadeTop>
            <div className="text-n800">
              <LinkButton link="/sign-up" text="Trouver du travail" isBgWhite={true} />
            </div>
          </FadeTop>
        </div>
      </div>
    </section>
  );
}

export default GetWorkersGigs;
