import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '@/services/firebase';
import { useAuthStore } from '@/store/authStore';

/** Subscribes to Firebase auth state once at the app root; keeps authStore in sync. */
export function useAuthListener() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return unsubscribe;
  }, [setUser]);
}

/** Convenience accessor for the current auth state in screens/components. */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  return { user, isInitializing, isSignedIn: !!user };
}
