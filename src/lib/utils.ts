import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { UserRole } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Maps UserRole enum to translation key
 */
const ROLE_TRANSLATION_KEYS: Record<UserRole, string> = {
  [UserRole.Admin]: 'admin',
  [UserRole.Annotator]: 'annotator',
  [UserRole.Reviewer]: 'reviewer',
  [UserRole.FinalReviewer]: 'finalReviewer',
}

export function getRoleTranslationKey(role: UserRole): string {
  return ROLE_TRANSLATION_KEYS[role] ?? 'annotator'
}

/**
 * Converts S3 URLs to use the Vite proxy in development to bypass CORS
 */
export function getProxiedUrl(url: string): string {
  if (import.meta.env.DEV && url.includes('s3.us-east-1.amazonaws.com')) {
    return url.replace('https://s3.us-east-1.amazonaws.com', '/s3-proxy')
  }
  return url
}

function isTiffUrl(url: string): boolean {
  const lower = url.toLowerCase()
  return lower.endsWith('.tiff') || lower.endsWith('.tif')
}

/**
 * Preloads an image through the correct pipeline (proxied URL).
 * For TIFFs, warms the HTTP cache via fetch so the TIFF decoder gets a cache hit.
 * For standard images, uses the browser's native Image preload.
 */
export function preloadImage(url: string): void {
  const proxied = getProxiedUrl(url)

  if (isTiffUrl(url)) {
    fetch(proxied).catch(() => {})
  } else {
    const img = new Image()
    img.src = proxied
  }
}