import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';

export async function signUp(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }
  await setDoc(doc(db, 'users', credential.user.uid), {
    displayName: displayName.trim() || null,
    createdAt: serverTimestamp(),
  });
  return credential.user;
}

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function signOutUser() {
  await signOut(auth);
}

/**
 * Sends a password reset email. Resolves silently even if the email isn't
 * registered, so the UI can show one generic message and avoid leaking
 * which emails have an account (standard practice for reset flows).
 */
export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    const code = (error as { code?: string })?.code ?? '';
    if (code !== 'auth/user-not-found') {
      throw error;
    }
  }
}

/** Maps common Firebase Auth error codes to Vietnamese messages for display. */
export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Email không hợp lệ.';
    case 'auth/email-already-in-use':
      return 'Email này đã được đăng ký.';
    case 'auth/weak-password':
      return 'Mật khẩu quá yếu (tối thiểu 6 ký tự).';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email hoặc mật khẩu không đúng.';
    case 'auth/too-many-requests':
      return 'Thử lại quá nhiều lần. Vui lòng đợi một chút rồi thử lại.';
    default:
      return 'Có lỗi xảy ra. Vui lòng thử lại.';
  }
}
