"use client";

import Link from "next/link";
import { dashboardProfileLink } from "../../data/data";
import useClickOutside from "../../hooks/useClickOutside";
import userImg from "@/public/images/review_people_1.png";
import Image from "next/image";

function DashboardProfileLinkModal() {
  const { modal, setModal, modalRef } = useClickOutside();
  return (
    <div
      onClick={() => setModal((prev) => !prev)}
      ref={modalRef}
      className="relative cursor-pointer rounded-full bg-n30 p-px"
    >
      <Image src={userImg} className="size-11 rounded-full" alt="" />
      <div
        className={`absolute rtl:left-0 ltr:right-0 top-12 w-[200px] origin-top-right rounded-2xl border border-n30 bg-white py-4 duration-500 ${
          modal
            ? "visible scale-100 opacity-100"
            : "invisible scale-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-3 rtl:pr-4 ltr:pl-4">
          {dashboardProfileLink.map(({ id, name, link }) => (
            <li key={id} className="font-medium duration-500 hover:text-r300">
              <Link href={link}>{name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardProfileLinkModal;
