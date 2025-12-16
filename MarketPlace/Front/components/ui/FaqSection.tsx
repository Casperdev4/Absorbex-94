"use client";

import { faqData } from "@/data/data";
import { useState } from "react";
import { PiCaretDown } from "react-icons/pi";

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="stp-30 sbp-30">
      <div className="container">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="heading-2 font-bold text-n900">
            Questions <span className="text-b300 underline">fréquentes</span>
          </h2>
          <p className="pt-4 text-n500">
            Trouvez des réponses aux questions les plus courantes.
          </p>
        </div>

        <div className="stp-15 flex flex-col gap-4">
          {faqData.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl border border-n30 bg-white"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between p-4 text-left sm:p-6"
              >
                <span className="pr-4 font-semibold text-n900">
                  {item.question}
                </span>
                <span
                  className={`text-2xl text-n500 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <PiCaretDown />
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-4 pb-4 text-n500 sm:px-6 sm:pb-6">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
