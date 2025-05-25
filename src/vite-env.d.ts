/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_API: string
  readonly VUE_APP_BASE_API: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/styles/element-variables.scss' {
  const variables: Record<string, string>
  export default variables
}

declare module 'path-to-regexp' {
  export function compile(path: string): (params?: any) => string
} 