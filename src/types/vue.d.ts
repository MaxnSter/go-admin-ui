declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/utils/auth' {
  export function getToken(): string | null
  export function setToken(token: string): void
  export function removeToken(): void
}

declare module '@/utils/get-page-title' {
  export default function getPageTitle(pageTitle?: string): string
}

declare module 'nprogress' {
  interface NProgress {
    configure(options: { showSpinner?: boolean }): void
    start(): void
    done(): void
  }
  const nprogress: NProgress
  export default nprogress
} 