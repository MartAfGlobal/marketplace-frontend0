import type { Metadata } from "next";
import ClientProvider from "@/components/store/client-provider";
import "./globals.css";
import LayoutWrapper from "@/components/ui/LayoutWrappers/LayoutWrapper"; // Adjust the path if needed
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "market place",
  description: "Buying and selling web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          <LayoutWrapper>
              <Toaster richColors position="top-right" />
            {children}
          </LayoutWrapper>
        </ClientProvider>
      </body>
    </html>
  );
}
