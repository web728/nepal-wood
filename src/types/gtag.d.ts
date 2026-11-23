
export {};

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js' | 'set' | 'consent',
      target: string | Date,
      parameters?: Record<string, unknown>
    ) => void;
  }
}
