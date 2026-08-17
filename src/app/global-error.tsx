'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-zinc-100 p-4 font-sans text-zinc-900">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-lg">
          <h2 className="text-xl font-bold text-red-600">Something went wrong!</h2>
          <p className="mt-2 text-sm text-zinc-600">
            {error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => reset()}
            className="mt-4 rounded-lg bg-brand-brown px-4 py-2 text-xs font-bold text-white transition-all hover:bg-black"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}