import SalesChart from "@/components/ui/seller-components/body-components/over-view/chat-section/chat";
import SecondChat from "./second-chat";

export default function Charts() {
  
  return (
    <div className="flex flex-col lg:flex-row  gap-6 lg:gap-8 justify-center">
      <div className="hidden lg:block w-full  ">
        <SalesChart />
      </div>
      <div className="w-full max-w-134.75">
        <SecondChat />
      </div>
    </div>
  );
}
