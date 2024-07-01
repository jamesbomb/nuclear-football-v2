// src/renderer/electron.d.ts

declare interface Window {
  electronAPI: {
    shutdown(): void
  }
}
