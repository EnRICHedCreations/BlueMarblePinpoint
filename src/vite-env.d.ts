/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENCAGE_API_KEY: string;
  readonly VITE_DEFAULT_LAT?: string;
  readonly VITE_DEFAULT_LNG?: string;
  readonly VITE_DEFAULT_ZOOM?: string;
  readonly VITE_GA_TRACKING_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
