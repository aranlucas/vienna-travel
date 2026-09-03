'use client'

import { useState } from 'react'

export function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(address).then(
          () => {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
          },
          () => setCopied(false),
        )
      }}
      className="inline-flex min-h-[44px] items-center text-amber transition-colors hover:text-cream"
      aria-live="polite"
    >
      {copied ? 'Copied ✓' : 'Copy address'}
    </button>
  )
}
