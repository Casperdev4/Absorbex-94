import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RTLToggleButton from "@/components/ui/RTLToggleButton";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-n20 pb-10">
      <DashboardHeader />
      {children}
      <RTLToggleButton />
    </main>
  );
}

export default layout;
