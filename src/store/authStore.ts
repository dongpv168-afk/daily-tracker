import type { User } from 'firebase/auth';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  /** True until the first onAuthStateChanged callback fires (session restore from storage). */
  isInitializing: boolean;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitializing: true,
  setUser: (user) => set({ user, isInitializing: false }),
}));
