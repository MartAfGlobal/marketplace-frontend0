import SalesChart from "@/components/ui/seller-components/body-components/over-view/chat-section/chat";
import SecondChat from "./second-chat";

export default function Charts() {
  
  return (
    <div className=" flex gap-8 justify-center">
      <SalesChart />
      <SecondChat/>
    </div>
  );
}
