/// <reference types="vite/client" />

/**
 * Vite's `?url` suffix resolves an asset to its emitted URL string.
 * TypeScript needs to be told about the suffixed specifier explicitly.
 */
declare module '*?url' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
