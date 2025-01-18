import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encryptKey(passcode: string) {
  return btoa(passcode);
}

export function decryptKey(passcode: string) {
  return atob(passcode);
}

export function reloadPage() {
  window.location.reload();
}