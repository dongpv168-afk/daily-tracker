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
  // Subscribed so profile edits (which mutate `user` in place) still trigger a re-render here —
  // see profileVersion's doc comment in authStore.
  useAuthStore((state) => state.profileVersion);
  // Firebase's updateProfile() mutates auth.currentUser in place but doesn't reliably fire
  // onAuthStateChanged — call this after such an update so screens re-render with the new value.
  const refreshUser = () => useAuthStore.getState().bumpProfile();
  return { user, isInitializing, isSignedIn: !!user, refreshUser };
}
