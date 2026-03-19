"use client"

import OverviewBody from "./over-view/overview";
import ProductBody from "./products/productBody";
import SelleOrderspage from "./Order-management/seller-orders";
import FinanceSecions from "./Finance/finance-body";

export function Overview() {
  return <div ><OverviewBody/></div>;
}
export function Products() {
  return <div className=""><ProductBody/></div>;
}
export function Orders() {
  return <div className=""><SelleOrderspage/></div>;
}
export function Finance() {
  return <div className=""> <FinanceSecions/></div>;
}
export function Customers() {
  return <div className="p-4"></div>;
}
