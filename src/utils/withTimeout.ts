export class TimeoutError extends Error {}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError('timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/**
 * Firestore's write promises (addDoc/setDoc/updateDoc/deleteDoc) don't resolve until the write
 * reaches the server — while offline they just hang forever, leaving Save buttons spinning with
 * no feedback. The write is already applied to Firestore's local cache the instant it's called
 * (that's why it shows up immediately in other screens via onSnapshot), so if the promise hasn't
 * settled after `timeoutMs`, we treat it as "queued, will sync later" rather than blocking the UI.
 * A real error (e.g. permission-denied) rejects immediately and is rethrown as-is.
 */
export async function resilientWrite(promise: Promise<unknown>, timeoutMs = 5000): Promise<void> {
  try {
    await withTimeout(promise, timeoutMs);
  } catch (error) {
    if (error instanceof TimeoutError) return;
    throw error;
  }
}
