"use client";

import { useState } from "react";
import { PiCaretDown } from "react-icons/pi";
import useClickOutside from "../../hooks/useClickOutside";

const serviceList = ["Photographie", "Rénovation", "Ménage", "Bricolage"];

function ServiceModal() {
  const { modal, setModal, modalRef } = useClickOutside();

  const [service, setService] = useState<null | string>(null);
  return (
    <div className="relative flex cursor-pointer items-center justify-between gap-2">
      <span className="serviceText" onClick={() => setModal((prev) => !prev)}>
        {service === null ? (
          <>
            {" "}
            <span className="max-[400px]:hidden">Choisir</span> Service
          </>
        ) : (
          service
        )}
      </span>
      <PiCaretDown />

      <div
        className={`absolute rtl:right-0 ltr:left-0 top-10 w-[150px] origin-top rounded-3xl border border-n30 bg-white py-3 text-base duration-700 max-sm:text-sm sm:-left-8 sm:w-[200px] sm:py-5 max-h-[300px] overflow-y-auto overflow-x-hidden ${
          modal
            ? "visible scale-100 opacity-100"
            : "invisible scale-0 opacity-0"
        }`}
        ref={modalRef}
      >
        {serviceList.map((item, idx) => (
          <p
            onClick={() => {
              setService(item);
              setModal(false);
            }}
            key={idx}
            className="serviceItem cursor-pointer px-3 py-2 duration-500 hover:bg-b300 hover:text-white sm:px-6 text-start"
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default ServiceModal;
