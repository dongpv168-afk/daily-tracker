// firebase's package.json "exports" map for the "firebase/auth" subpath always resolves
// TypeScript types to a build that omits the React Native entry point (key ordering bug in
// @firebase/auth's own exports map — the "types" condition matches before "react-native" gets a
// chance to). Metro resolves the JS correctly at runtime; only the .d.ts lookup is wrong.
// Tracked upstream: https://github.com/firebase/firebase-js-sdk/issues/9316
//
// This augmentation restores the type so `getReactNativePersistence` doesn't need `any`/ts-ignore.
import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
