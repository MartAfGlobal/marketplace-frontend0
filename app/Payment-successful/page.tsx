// // app/Payment-successful/page.tsx

// import OrderSuccess from "@/components/martaf/OrderSuccess";
// import { apiService } from "@/lib/api";



// interface PageProps {
//   searchParams: {
//     orderId: string;
//   };
// }

// export default async function PaymentSuccessfulPage({ searchParams }: PageProps) {
//   const orderId = searchParams.orderId;

//   if (!orderId) {
//     return <div className="text-center p-10">Missing order ID</div>;
//   }

//   const data = await apiService.getOrderSuccessData(orderId);

//   return <OrderSuccess {...data} isMobile={false} />;
// }
