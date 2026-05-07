import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manager Update | Martaf",
  description: "Manager page for updating category and related product image.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
