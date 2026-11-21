'use client';

/** A single explicit reCAPTCHA v2 loader shared by all forms on this page. */
export interface RecaptchaAPI {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: 'light' | 'dark';
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    },
  ) => number;
  reset: (widgetId: number) => void;
}

declare global {
  interface Window {
    grecaptcha?: RecaptchaAPI;
    __nepalWoodCaptchaReady?: () => void;
  }
}

const SCRIPT_ID = 'nepalwood-recaptcha-api';
const TIMEOUT_MS = 5500;
let pending: Promise<RecaptchaAPI> | null = null;

function available(): RecaptchaAPI | null {
  const api = window.grecaptcha;
  return api && typeof api.render === 'function' && typeof api.reset === 'function'
    ? api
    : null;
}

function loadFrom(host: 'www.google.com' | 'www.recaptcha.net'): Promise<RecaptchaAPI> {
  const existing = available();
  if (existing) return Promise.resolve(existing);

  return new Promise((resolve, reject) => {
    let finished = false;
    let timer: ReturnType<typeof setTimeout>;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://${host}/recaptcha/api.js?onload=__nepalWoodCaptchaReady&render=explicit`;
    script.referrerPolicy = 'strict-origin-when-cross-origin';

    const cleanup = () => {
      clearTimeout(timer);
      script.onerror = null;
      if (window.__nepalWoodCaptchaReady === onReady) {
        delete window.__nepalWoodCaptchaReady;
      }
    };

    const fail = (message: string) => {
      if (finished) return;
      finished = true;
      cleanup();
      script.remove();
      reject(new Error(message));
    };

    const onReady = () => {
      const api = available();
      if (!api || finished) return;
      finished = true;
      cleanup();
      resolve(api);
    };

    window.__nepalWoodCaptchaReady = onReady;
    script.onerror = () => fail(`Cannot load Google verification from ${host}`);
    timer = setTimeout(() => fail(`Verification timed out at ${host}`), TIMEOUT_MS);
    document.head.appendChild(script);

    // Another form/script may have loaded the API in the meantime.
    onReady();
  });
}

export function loadRecaptcha(): Promise<RecaptchaAPI> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('reCAPTCHA only runs in the browser'));
  }

  const ready = available();
  if (ready) return Promise.resolve(ready);
  if (pending) return pending;

  // A blocked google.com connection can sometimes use Google's documented alternative host.
  pending = (async () => {
    try {
      return await loadFrom('www.google.com');
    } catch {
      return await loadFrom('www.recaptcha.net');
    }
  })().catch((error: unknown) => {
    pending = null; // Manual Retry may attempt loading again.
    throw error;
  });

  return pending;
}
