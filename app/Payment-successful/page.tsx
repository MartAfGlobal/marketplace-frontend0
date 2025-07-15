import { CheckCircle, Lock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  id: number;
  name: string;
  shop: string;
  quantity: number;
  color: string;
  image: string;
  price: number;
}

interface Props {
  isMobile: boolean;
  items: OrderItem[];
  address: string;
  phone: string;
  name: string;
  orderId: string;
  seller: string;
  orderDate: string;
  deliveryDate: string;
  card: string;
  cardType: string;
  total: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
}

export default function OrderSuccess({
  isMobile,
  items,
  address,
  phone,
  name,
  orderId,
  seller,
  orderDate,
  deliveryDate,
  card,
  cardType,
  total,
  subtotal,
  discount,
  shippingFee,
}: Props) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 bg-white rounded-xl p-6 md:p-10 shadow-sm">
        {/* Success Content */}
        <div className="flex-1 space-y-6">
          <div className="text-center">
            <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Payment successful</h2>
            <p className="text-gray-500 text-sm">
              Your order is on its way. It will arrive between {deliveryDate}
            </p>
          </div>

          {/* Order Info */}
          <div className="space-y-2 text-sm">
            <p>
              <strong>Order ID:</strong> {orderId}
            </p>
            <p>
              <strong>Seller:</strong> {seller}
            </p>
            <p>
              <strong>Order date:</strong> {orderDate}
            </p>
            <p>
              <strong>Delivery date:</strong> {deliveryDate}
            </p>
          </div>

          {/* Address */}
          <div className="space-y-1 text-sm">
            <p className="font-semibold">Address for delivery</p>
            <p>{name}</p>
            <p>{phone}</p>
            <p>{address}</p>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h3 className="font-semibold">Ordered items</h3>
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover w-16 h-16"
                />
                <div className="text-sm">
                  <p className="font-semibold line-clamp-1">{item.name}</p>
                  <p className="text-gray-500">{item.shop}</p>
                  <p className="text-xs mt-1 bg-gray-100 rounded px-2 py-0.5 inline-block">
                    {item.quantity}PC, {item.color}
                  </p>
                </div>
                <span className="ml-auto font-semibold">₦{item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary (Desktop only) */}
        {!isMobile && (
          <div className="w-full md:max-w-sm space-y-6 border-l md:pl-8">
            <div className="text-right space-y-1">
              <p className="text-sm text-gray-500">Payment method</p>
              <p className="text-base font-semibold">{card}</p>
              <p className="text-blue-600 font-bold text-sm">{cardType}</p>
            </div>

            {/* Security notice */}
            <div className="flex gap-3 items-start">
              <ShieldCheck className="text-green-600 w-5 h-5 mt-1" />
              <p className="text-xs text-gray-600">
                Every payment you make on MartAf is secured with strict SSL encryption and PCI DSS data protection protocols.
              </p>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total items</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discounts</span>
                <span className="text-red-500">-₦{discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping fee</span>
                <span>₦{shippingFee.toLocaleString()}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Order total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                href="/cart"
                className="flex-1 py-2 rounded-lg text-center bg-[#FF715B] hover:bg-[#ff4d2d] text-white font-semibold"
              >
                Go to cart
              </Link>
              <Link
                href="/"
                className="flex-1 py-2 rounded-lg text-center border border-[#FF715B] text-[#FF715B] font-semibold"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        )}

        {/* Actions & Summary (Mobile) */}
        {isMobile && (
          <div className="mt-6 space-y-4">
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 py-2 border border-[#FF715B] rounded-lg text-center text-[#FF715B] font-semibold"
              >
                Go home
              </Link>
              <Link
                href="/orders"
                className="flex-1 py-2 bg-[#FF715B] hover:bg-[#ff4d2d] rounded-lg text-center text-white font-semibold"
              >
                Check my order
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}