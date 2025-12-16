import FixedPriceService from "@/components/homeOne/FixedPriceService";
import FixedPriceService2 from "@/components/homeOne/FixedPriceService2";
import GetHelpToday from "@/components/homeOne/GetHelpToday";
import GetWorkersGigs from "@/components/homeOne/GetWorkersGigs";
import HeroSection from "@/components/homeOne/HeroSection";
import HowItWorks from "@/components/homeOne/HowItWorks";
import NewsLetter from "@/components/homeOne/NewsLetter";
import RecentPosts from "@/components/homeOne/RecentPosts";
import SecureGuard from "@/components/homeOne/SecureGuard";
import Testimonial from "@/components/homeOne/Testimonial";
import TopExperts from "@/components/homeOne/TopExperts";

function page() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FixedPriceService />
      <TopExperts />
      <FixedPriceService2 />
      <NewsLetter />
      <SecureGuard />
      <Testimonial />
      <GetWorkersGigs />
      <RecentPosts />
      <GetHelpToday />
    </>
  );
}

export default page;
