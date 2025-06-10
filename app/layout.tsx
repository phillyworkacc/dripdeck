import "@/styles/global.css";
import type { Metadata } from "next";
import { InterFont } from "./font";
import { Toaster } from "sonner";
import { ImageContextMenuProvider } from "@/components/ImageContextMenu/ImageContextMenuContext";
import { ClothingListProvider } from "@/components/ClothingList/ClothingListContext";
import { ModalProvider } from "@/components/Modal/ModalContext";

export const metadata: Metadata = {
  title: 'DripDeck',
  description: 'Design, layer, and experiment with your style using DripDeck — the ultimate outfit builder. Upload clothing items and create the perfect fit.',
  keywords: 'DripDeck, outfit builder, outfit canvas, style app, fashion app, clothing drag and drop, wardrobe designer, fit builder',
  authors: [{ name: 'DripDeck Team' }],
  openGraph: {
    title: 'DripDeck',
    description: 'Design, layer, and experiment with your style using DripDeck — the ultimate outfit builder.',
    url: 'https://your-dripdeck-url.com',
    siteName: 'DripDeck',
    images: [
      {
        url: 'https://your-dripdeck-url.com/og-image.jpg', // replace with your OG image URL
        width: 1200,
        height: 630,
        alt: 'DripDeck Outfit Builder',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DripDeck',
    description: 'Design, layer, and experiment with your style using DripDeck — the ultimate outfit builder.',
    images: ['https://your-dripdeck-url.com/og-image.jpg'], // same OG image
  },
  metadataBase: new URL('https://your-dripdeck-url.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClothingListProvider>
      <ImageContextMenuProvider>
        <ModalProvider>
          <html lang="en">
            <head>
              <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
              <link rel="manifest" href="/manifest.json" />
              <link rel="apple-touch-icon" href="/favicon.ico" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
              <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
            </head>
            <body className={InterFont.className}>
              <Toaster richColors position="top-center" />
              {children}
            </body>
          </html>
        </ModalProvider>
      </ImageContextMenuProvider>
    </ClothingListProvider>
  );
}
