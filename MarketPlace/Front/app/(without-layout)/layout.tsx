import RTLToggleButton from "@/components/ui/RTLToggleButton";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {children}

      <ScrollToTopButton />
      <RTLToggleButton />
    </main>
  );
}

export default layout;
