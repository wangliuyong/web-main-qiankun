/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** nest-server API 基址（预留） */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
