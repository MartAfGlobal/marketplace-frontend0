// app/Payment-successful/page.tsx

import OrderSuccess from "@/components/martaf/OrderSuccess";
import { apiService } from "@/lib/api";


export default async function PaymentSuccessfulPage({ searchParams }: { searchParams: { orderId: string } }) {
  const orderId = searchParams.orderId;

  if (!orderId) {
    return <div className="text-center p-10">Order ID is missing</div>;
  }

  const data = await apiService.getOrderSuccessData(orderId);

  return <OrderSuccess {...data} isMobile={false} />;
}
