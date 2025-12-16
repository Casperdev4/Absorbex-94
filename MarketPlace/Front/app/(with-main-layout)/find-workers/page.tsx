import FaqSection from "@/components/ui/FaqSection";
import BreadCrumb from "@/components/global/BreadCrumb";
import NewsLetter from "@/components/homeOne/NewsLetter";
import WorkersList from "@/components/workers/WorkersList";

function page() {
  return (
    <>
      <BreadCrumb pageName="Trouver un prestataire" />

      <WorkersList />

      <NewsLetter />
      <FaqSection />
    </>
  );
}

export default page;
