"use client";
export default function Err({ reset }: { error: Error; reset: () => void }) {
  return <div className="wrap grid min-h-[60vh] place-items-center py-20 text-center"><div><h1 className="text-2xl font-bold">Something went wrong</h1><p className="mt-2 text-muted">Please try again in a moment.</p><button onClick={reset} className="btn mt-6">Try again</button></div></div>;
}
