import Header from "@/components/global/Header";
import FooterOne from "@/components/global/footer/FooterOne";
import RTLToggleButton from "@/components/ui/RTLToggleButton";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header />
      {children}
      <FooterOne />
      <ScrollToTopButton />
      <RTLToggleButton />
    </main>
  );
}

export default layout;
