import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WhoAmEye – Modern Profile Cards & Bio Links",
    template: "%s | WhoAmEye",
  },
  description:
    "Create a stunning, customizable profile card. Share your story, links, and gallery with the world. WhoAmEye lets you express yourself with modern design, creative freedom, and a unique public URL.",
  keywords: [
    "profile card",
    "bio link",
    "customizable",
    "gallery",
    "social links",
    "WhoAmEye",
    "modern profile",
    "personal website",
    "portfolio",
    "identity",
    "creative",
    "themes",
    "public profile",
    "nextjs",
  ],
  metadataBase: new URL("https://whoameye.com"),
  openGraph: {
    title: "WhoAmEye – Modern Profile Cards & Bio Links",
    description:
      "Create a stunning, customizable profile card. Share your story, links, and gallery with the world. WhoAmEye lets you express yourself with modern design, creative freedom, and a unique public URL.",
    url: "https://whoameye.com",
    siteName: "WhoAmEye",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WhoAmEye – Modern Profile Cards & Bio Links",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhoAmEye – Modern Profile Cards & Bio Links",
    description:
      "Create a stunning, customizable profile card. Share your story, links, and gallery with the world. WhoAmEye lets you express yourself with modern design, creative freedom, and a unique public URL.",
    images: ["/og-image.png"],
    creator: "@whoameyeapp",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  generator: "Next.js",
  applicationName: "WhoAmEye",
  authors: [{ name: "WhoAmEye Team", url: "https://whoameye.com" }],
  creator: "WhoAmEye Team",
  publisher: "WhoAmEye",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
