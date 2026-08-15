import type { User } from 'firebase/auth';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  /** True until the first onAuthStateChanged callback fires (session restore from storage). */
  isInitializing: boolean;
  setUser: (user: User | null) => void;
  /**
   * Bumped after in-place profile edits (e.g. updateProfile()), which mutate the same `user`
   * object reference rather than replacing it — so subscribers keyed only on `user` wouldn't
   * otherwise notice the change. Components that read profile fields should also select this.
   */
  profileVersion: number;
  bumpProfile: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitializing: true,
  setUser: (user) => set({ user, isInitializing: false }),
  profileVersion: 0,
  bumpProfile: () => set((state) => ({ profileVersion: state.profileVersion + 1 })),
}));
