import { PiCaretLeft, PiCaretRight } from "react-icons/pi";

function Pagination() {
  return (
    <ul className="flex items-center justify-center gap-2 font-medium text-white sm:gap-3">
      <li className="flex cursor-pointer items-center justify-center rounded-full bg-n900 p-[14px] text-xl duration-500 hover:bg-b300">
        <PiCaretLeft />
      </li>
      <li className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-n900 duration-500 hover:bg-b300">
        1
      </li>
      <li className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-b300">
        2
      </li>
      <li className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-n900 duration-500 hover:bg-b300">
        3
      </li>
      <li className="flex cursor-pointer items-center justify-center rounded-full bg-n900 p-[14px] text-xl duration-500 hover:bg-b300">
        <PiCaretRight />
      </li>
    </ul>
  );
}

export default Pagination;
