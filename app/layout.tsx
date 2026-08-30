import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
})

const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  weight: 'variable',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Austria Expedition 2026',
  description: 'Sept 5–14 | Vienna · Salzkammergut · Tyrol · Innsbruck',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${sourceSerif.variable}`}>
      <body className="bg-dark-surface text-cream antialiased">{children}</body>
    </html>
  )
}
