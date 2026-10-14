"use client";

import { useState } from "react";

export function CopyAddressButton({ address }: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(address).then(
          () => {
            setCopied(true);

            return window.setTimeout(() => setCopied(false), 2000);
          },
          () => setCopied(false),
        );
      }}
      className="inline-flex min-h-touch items-center text-amber transition-colors hover:text-cream"
      aria-live="polite"
    >
      {copied ? "Copied ✓" : "Copy address"}
    </button>
  );
}

type CopyAddressButtonProps = { address: string };
