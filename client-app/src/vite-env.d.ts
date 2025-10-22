/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENVIRONMENT: string
  readonly VITE_ENABLE_DEBUG_LOGS: string
  readonly VITE_ENABLE_REQUEST_LOGGING: string
  readonly VITE_ITEMS_PER_PAGE: string
  readonly VITE_DEFAULT_CURRENCY: string
  readonly VITE_DEV_SERVER_PORT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Declare module types for image imports
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}