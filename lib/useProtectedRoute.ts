import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

export function useProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const navigateToProtectedRoute = (path: string) => {
    if (isAuthenticated) {
      router.push(path);
    } else {
      // Redirect to login with the intended destination
      router.push(`/login?redirect=${encodeURIComponent(path)}`);
    }
  };

  return { navigateToProtectedRoute, isAuthenticated };
} 