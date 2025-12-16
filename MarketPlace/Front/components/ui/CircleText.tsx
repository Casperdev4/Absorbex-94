import { PiPaperPlaneTilt } from "react-icons/pi";

function CircleText() {
  const circleText = "On Demand Service Available*";

  return (
    <div className="relative z-20">
      <div className="-mb-20 flex items-center justify-center max-lg:hidden">
        <div className="relative flex h-[160px] w-[160px] items-center justify-center rounded-full bg-white text-white">
          <div className="logo absolute z-10 flex h-[100px] w-[100px] items-center justify-center rounded-full border border-white text-5xl !leading-none">
            <PiPaperPlaneTilt />
          </div>
          <div className="circleText circle absolute h-[95%] w-[95%] rounded-full bg-r300 font-medium">
            <p>
              {circleText.split("").map((char, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 origin-[0_75px]"
                  style={{ transform: `rotate(${i * 12.3}deg)` }}
                >
                  {char}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CircleText;
