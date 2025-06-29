// app/order-details/[orderId]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CreditCard, Lock, ArrowLeft, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MoreToLove from "@/components/martaf/MoreToLove";
import { ConfirmDeliveryModal } from "@/components/martaf/ConfirmDeliveryModal";
import { toast } from "sonner";

type Product = {
  id: number;
  title: string;
  quantity: string;
  color: string;
  price: number;
  image: string;
};

type Order = {
  id: string;
  seller: string;
  orderDate: string;
  deliveryDate: string;
  products: Product[];
  total: number;
  discounts: number;
  shippingFee: number;
  paymentMethod: string;
  cardLast4: string;
};

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmDelivery = (orderId: number) => {
    toast.success(`Delivery confirmed for order #${orderId}`)
    // You can call your API here
  };

  useEffect(() => {
    // Replace with actual fetch
    setOrder({
      id: String(orderId),
      seller: "Kirricho stores",
      orderDate: "May 15, 2025",
      deliveryDate: "June 15, 2025 - July 25, 2025",
      products: [
        {
          id: 1,
          title: "Nike shoes XI fine blue",
          quantity: "2PC",
          color: "Black",
          price: 15000,
          image:
            "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: 2,
          title: "Nike shoes XI fine blue",
          quantity: "2PC",
          color: "Black",
          price: 5000,
          image:
            "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: 3,
          title: "Nike shoes XI fine blue",
          quantity: "2PC",
          color: "Black",
          price: 5000,
          image:
            "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=400&q=80",
        },
      ],
      total: 30000,
      discounts: 25000,
      shippingFee: 5000,
      paymentMethod: "Credit/Debit card",
      cardLast4: "**** **** **** 7767",
    });
  }, [orderId]);

  if (!order) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-4 min-h-screen">
      {/* Back */}
      <Link href="/account">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Order on its way
        </Button>
      </Link>

      <div className="bg-white p-8 mt-4 border rounded-lg gap-8 flex flex-col md:mx-auto md:w-[65%] ">
        {/* Left - Order Info */}
        <div className="md:flex justify-between ">
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold flex gap-2">
                Order ID: {order.id}
                <span>
                  <Copy className="w-4 h-4" />
                </span>
              </p>
              <p className="text-sm">Seller: {order.seller}</p>
              <p className="text-sm">Order date: {order.orderDate}</p>
              <p className="text-sm">Delivery date: {order.deliveryDate}</p>
            </div>

            <div className="flex flex-col gap-2 border-t md:border-none py-4 md:py-0">
              <h3 className="font-semibold">Address for delivery</h3>
              <p className="text-sm">Chisom Ebube Chris</p>
              <p className="text-sm">+2347034562314</p>
              <p className="text-sm">
                LEA Primary School Dakwo, Abuja
                <br />
                Kabusa, Abuja, Nigeria, 900102
              </p>
            </div>
          </div>
           {/* Modal */}
          <ConfirmDeliveryModal
            open={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleConfirmDelivery}
            orderId={orderId ? parseInt(orderId as string) : undefined}
          />
          <div className="flex flex-col gap-8 md:w-[40%] mt-4 md:mt-0 border-t md:border-none pt-4 md:pt-0">
            <div className="hidden md:flex flex-col gap-4">
              <Button className="bg-[#FF715B] hover:bg-[#ff4d2d] text-white w-full"
                onClick={() => setShowConfirmModal(true)}
              >
                Confirm delivery
              </Button>
              <Button
                variant="outline"
                className="w-full text-orange-600 border-orange-400 bg-orange-50 hover:bg-orange-100"
              >
                Track order
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold mb-1">Payment method</h3>
              <div className="text-sm text-gray-700">{order.paymentMethod}</div>
              <div className="text-sm font-mono font-semibold mt-1">
                {order.cardLast4}
              </div>
              <div className="flex items-center mt-2 text-sm font-semibold">
                <Lock className="w-4 h-4 mr-2 text-green-600" />
                Secure payments
              </div>
              <p className="text-xs mt-3">
                Every payment you make on MartAf is secured with strict SSL
                encryption PCI DSS data protection protocols
              </p>
            </div>
          </div>
        </div>

        <div className="md:flex justify-between">
          {/* Product List */}
          <div className="flex-1 border-t md:border-none py-6 md:py-0">
            <p className="md:hidden font-semibold mb-6">Package details</p>
            {order.products.map((product) => (
              <div key={product.id} className="flex items-start gap-6">
                <div className="w-20 h-20 relative rounded overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <p className="text-sm font-semibold">{product.title}</p>
                  <p className="text-xs w-24 p-2 font-semibold rounded-4xl bg-neutral-100 ">
                    {product.quantity}, {product.color}
                  </p>
                  <div className="text-sm font-semibold">
                    ₦{product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* payment details */}
          <div className="md:w-[40%] border-t md:border-none">
            <div className="flex flex-col gap-2 py-6 md:py-0">
              <p className="font-semibold">Payment details</p>
              <p className="text-xs">Total</p>
              <p className="text-3xl font-bold">
                ₦{order.total.toLocaleString()}
              </p>
            </div>

            <div className="pt-4 text-sm border-t md:border-none">
              <div className="flex justify-between">
                <span>Total items</span>
                <span>
                  ₦
                  {(
                    order.total +
                    order.discounts -
                    order.shippingFee
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discounts</span>
                <span>-₦{order.discounts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  ₦{(order.total - order.shippingFee).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between mt-4 py-2 border-t">
                <span>Shipping fee</span>
                <span>₦{order.shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span>Order total</span>
                <span>₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <MoreToLove />
      </div>
    </div>
  );
}
