/// <reference types="vite/client" />

// Typed access to our custom environment variables (import.meta.env.VITE_*).
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
