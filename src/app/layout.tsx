import type { Metadata, Viewport } from "next";
import "./globals.css";
import NProgressLoader from "@/components/NProgressLoader";

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
  metadataBase: new URL("https://whoameye.net"),
  openGraph: {
    title: "WhoAmEye – Modern Profile Cards & Bio Links",
    description:
      "Create a stunning, customizable profile card. Share your story, links, and gallery with the world. WhoAmEye lets you express yourself with modern design, creative freedom, and a unique public URL.",
    url: "https://whoameye.net",
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
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  generator: "Next.js",
  applicationName: "WhoAmEye",
  authors: [{ name: "KayTwenty", url: "https://whoameye.net" }],
  creator: "KayTwenty",
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
    <html lang="en">
      <head>
        <link rel="canonical" href="https://whoameye.net/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "WhoAmEye",
              url: "https://whoameye.net/",
              description:
                "Create a stunning, customizable profile card. Share your story, links, and gallery with the world. WhoAmEye lets you express yourself with modern design, creative freedom, and a unique public URL.",
              publisher: {
                "@type": "Organization",
                name: "WhoAmEye",
                url: "https://whoameye.net/",
                logo: {
                  "@type": "ImageObject",
                  url: "https://whoameye.net/logo.svg",
                },
              },
            }),
          }}
        />
      </head>
      <body className={`antialiased bg-black text-white`}>
        <NProgressLoader />
        {children}
      </body>
    </html>
  );
}
