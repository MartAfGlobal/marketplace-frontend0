"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ReactNode } from 'react';

interface ProtectedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  [key: string]: any; // Allow other props
}

export function ProtectedLink({ href, children, className, ...props }: ProtectedLinkProps) {
  const { isAuthenticated } = useAuth();

  // If user is authenticated, use regular Link
  if (isAuthenticated) {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }

  // If not authenticated, redirect to login with the intended destination
  const loginUrl = `/login?redirect=${encodeURIComponent(href)}`;
  
  return (
    <Link href={loginUrl} className={className} {...props}>
      {children}
    </Link>
  );
} 