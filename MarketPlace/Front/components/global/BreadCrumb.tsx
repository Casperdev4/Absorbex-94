import expertImg1 from "@/public/images/expert_img_1.png";
import expertImg2 from "@/public/images/expert_img_2.png";
import expertImg3 from "@/public/images/expert_img_3.png";
import Image from "next/image";
import Link from "next/link";
import { PiArrowRightBold, PiCaretDoubleRight } from "react-icons/pi";
import SearchBox from "../ui/SearchBox";

type PropsType = {
  pageName: string;
  isSearchBoxShow?: boolean;
  isMiddlePage?: boolean;
  middlePageName?: string;
  middlePageLink?: string;
};

function BreadCrumb({
  pageName,
  isSearchBoxShow,
  isMiddlePage,
  middlePageName,
  middlePageLink,
}: PropsType) {
  return (
    <>
      <section className="sbp-30 mt-[100px] bg-n20 pt-6">
        <div className="container">
          <ul className="flex items-center justify-start gap-2 pt-3 font-medium">
            <li>
              <Link href="/">Accueil</Link>
            </li>
            {isMiddlePage && (
              <>
                <li className="">
                  <PiCaretDoubleRight />
                </li>
                <li>
                  <Link href={middlePageLink!}>{middlePageName}</Link>
                </li>
              </>
            )}
            <li className="text-r300">
              <PiCaretDoubleRight />
            </li>
            <li className="text-r300">{pageName}</li>
          </ul>
          <div className="flex items-center justify-between pt-10 max-md:gap-6 max-sm:flex-col">
            <div className="flex flex-col items-start justify-start">
              <h3 className="heading-3">Transformez cette recherche en annonce</h3>
              <p className="max-w-[500px] pt-3 text-lg font-medium text-n300">
                Publiez une annonce gratuitement et nous vous mettrons en relation
                avec les experts parfaits pour vos besoins.
              </p>
              <div className="pt-8">
                <Link
                  href="/post-task"
                  className="relative flex items-center justify-center overflow-hidden rounded-full bg-b300 px-4 py-2 text-lg font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3"
                >
                  <span className="relative z-10">Publier gratuitement</span>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-b50 bg-white p-6">
              <div className="flex items-center justify-between gap-10 pb-6">
                <p className="heading-5">Votre annonce</p>
                <p className="rounded-lg bg-b50 px-3 py-2 font-medium">
                  MATCHÉE
                </p>
              </div>
              <div className="flex items-center justify-start">
                <div className="rounded-full bg-white p-1">
                  <Image
                    src={expertImg1}
                    alt=""
                    className="size-12 rounded-full"
                  />
                </div>
                <div className="rtl:-mr-4 ltr:-ml-4 rounded-full bg-white p-1">
                  <Image
                    src={expertImg2}
                    alt=""
                    className="size-12 rounded-full"
                  />
                </div>
                <div className="rtl:-mr-4 ltr:-ml-4 rounded-full bg-white p-1">
                  <Image
                    src={expertImg3}
                    alt=""
                    className="size-12 rounded-full"
                  />
                </div>

                <div className="rtl:pr-8 ltr:pl-8 text-2xl ">
                  <PiArrowRightBold />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isSearchBoxShow && (
        <section className="">
          <div className="container -mt-8 md:-mt-16">
            <SearchBox />
          </div>
        </section>
      )}
    </>
  );
}

export default BreadCrumb;
