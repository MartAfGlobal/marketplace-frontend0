"use client";



import DashBoardHeadrLogo from "./header-components/logo";
import NavigationBar from "./header-components/navBars";
import EndNav from "./header-components/endNavBar";

export default function DashBoardHeader() {
  return (
    <header className="w-full h-18 bg-6a0dad text-ffffff justify-between flex items-center px-c56">
   < DashBoardHeadrLogo/>
    < NavigationBar/>
    < EndNav/>
    </header>
  );
}
