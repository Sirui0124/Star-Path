// @ts-ignore -- Suppress type error for firebase/app as initializeApp is a valid export in v9+ but types might mismatch in some envs
import { initializeApp } from "firebase/app";
// @ts-ignore -- Suppress type errors for firebase/analytics as it might be missing in some environments
import { getAnalytics, logEvent } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXAgZlQea0ewlkgwM_kFaAXbo98mOlL4I",
  authDomain: "sirui-s-game.firebaseapp.com",
  projectId: "sirui-s-game",
  storageBucket: "sirui-s-game.firebasestorage.app",
  messagingSenderId: "888689638618",
  appId: "1:888689638618:web:b0dc2575913059f3fe79e3",
  measurementId: "G-CX6EJR5P2D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics: any = null;

try {
  // Only initialize analytics in browser environment
  if (typeof window !== 'undefined' && typeof getAnalytics === 'function') {
    analytics = getAnalytics(app);
  }
} catch (e) {
  console.warn("Firebase Analytics failed to initialize.", e);
}

// Helper function to log events safely
export const logGameEvent = (eventName: string, params?: Record<string, any>) => {
  // Ensure analytics is initialized and logEvent is available
  if (!analytics || typeof logEvent !== 'function') return;
  try {
    logEvent(analytics, eventName, params);
  } catch (error) {
    console.warn("[Analytics] Failed to log event", error);
  }
};