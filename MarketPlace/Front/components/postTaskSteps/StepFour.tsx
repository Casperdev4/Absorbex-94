import { PiCurrencyDollarSimpleBold } from "react-icons/pi";

function StepFour() {
  return (
    <div>
      <h4 className="heading-4">Proposez votre budget</h4>

      <p className="pt-10 font-medium text-n300">Quel est votre budget ?*</p>
      <p className="pt-1 text-n300">
        Vous pourrez toujours négocier le prix final.*
      </p>

      <div className="mt-4 flex items-center justify-start gap-3 rounded-2xl bg-n30 p-3">
        <span className="text-xl font-bold">€</span>
        <input
          type="text"
          className="w-full bg-transparent outline-none placeholder:font-medium placeholder:text-n900"
          placeholder="Entrez votre budget"
        />
      </div>
    </div>
  );
}

export default StepFour;
