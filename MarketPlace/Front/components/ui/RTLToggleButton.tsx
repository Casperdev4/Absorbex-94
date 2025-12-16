"use client";
import { useState } from "react";
import { PiGearFill } from "react-icons/pi";

function RTLToggleButton() {
  const [toggle, setToggle] = useState("LTR");
  const [show, setShow] = useState(false);

  function toggleRtl(item: string) {
    const htmlTag = document.querySelector("html") as HTMLHtmlElement | null;

    if (htmlTag && item === "RTL") {
      htmlTag.dir = "rtl";
      setToggle(item);
    } else if (htmlTag) {
      htmlTag.dir = "ltr";
      setToggle(item);
    }
  }
  return (
    <div className=" overflow-hidden ">
      <div
        dir="ltr"
        className={`flex justify-start items-center fixed top-1/2  cursor-pointer z-50  ${
          show ? "right-2" : " -right-24"
        } duration-500`}
      >
        <div
          className="  text-2xl text-white bg-o300 p-2 rounded-l-xl "
          onClick={() => setShow((prev) => !prev)}
        >
          <PiGearFill className="circle" />
        </div>
        <div
          className={`flex justify-start items-center rounded-r-xl overflow-hidden `}
        >
          {["LTR", "RTL"].map((item, idx) => (
            <button
              key={idx}
              className={`${
                toggle === item ? "bg-b300 p-2 text-white" : "bg-n40 p-2"
              }`}
              onClick={() => toggleRtl(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RTLToggleButton;
