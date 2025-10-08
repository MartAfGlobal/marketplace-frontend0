import type { Metadata } from "next";
import ClientProvider from "@/components/store/client-provider";
import "./globals.css";
import LayoutWrapper from "@/components/ui/LayoutWrappers/LayoutWrapper";
import { Toaster } from "sonner";
import InstallButton from "@/components/ui/InstallButton"; // <- import it

export const metadata: Metadata = {
  title: "market Africa",
  description: "Martaf is a pan-African e-commerce platform that connects buyers worldwide to authentic, locally crafted African products",
  themeColor: "#6A0DAD",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA manifest + favicons */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6A0DAD" />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />

        {/* iOS icons */}
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-icon-167x167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />

        {/* iOS meta */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MARTAF" />

        {/* Windows meta */}
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body>
        <ClientProvider>
          <LayoutWrapper>
            <InstallButton />
            <Toaster richColors position="top-right" />
            {children}
            {/* Install button visible on all pages */}
            
          </LayoutWrapper>
        </ClientProvider>
      </body>
    </html>
  );
}
