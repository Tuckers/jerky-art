/// <reference types="@cloudflare/workers-types" />

// See https://svelte.dev/docs/kit/types#app
declare global {
  namespace App {
    interface Platform {
      env: {
        STORAGE_KV: KVNamespace;
        WRITE_TOKEN?: string;
      };
    }
  }
}

export {};
