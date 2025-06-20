"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Define routes where header should be hidden
  const authRoutes = [
    '/login',
    '/signup', 
    '/forgot-password',
    '/forgot-email'
  ];
  
  // Check if current path is an auth route or starts with auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Don't show header on auth pages
  if (isAuthRoute) {
    return null;
  }
  
  return <Header />;
} 