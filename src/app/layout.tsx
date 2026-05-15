import type { Metadata, Viewport } from "next";
import ClientProvider from "@/components/store/client-provider";
import "./globals.css";
import LayoutWrapper from "@/components/ui/LayoutWrappers/LayoutWrapper";
import { Toaster } from "sonner";
import InstallButton from "@/components/ui/InstallButton";
import ClientFcmWrapper from "@/components/ClientFcmWrapper";
import AxiosInterceptor from "@/components/auth/AxiosInterceptor";

export const metadata: Metadata = {
  title: "market Africa",
  description:
    "Martaf is a pan-African e-commerce platform that connects buyers worldwide to authentic, locally crafted African products",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#6A0DAD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6A0DAD" />

        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icon/apple-icon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon/apple-icon-32x32.png"
        />

        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/icon/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/icon/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icon/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icon/apple-icon-167x167.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icon/apple-icon-180x180.png"
        />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="MARTAF" />

        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body>
        <ClientProvider>
          <AxiosInterceptor>
            <LayoutWrapper>
              {/* <InstallButton /> */}
              <Toaster richColors position="top-right" duration={2000} />
              {children}
              <ClientFcmWrapper />
            </LayoutWrapper>
          </AxiosInterceptor>
        </ClientProvider>
      </body>
    </html>
  );
}
