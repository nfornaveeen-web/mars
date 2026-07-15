import type { Metadata } from "next";

export const siteConfig = {
  name: "Mars Technology Inc",
  url: "https://marstechnologyinc.com",
  description:
    "Mars Technology Inc is a B2B wholesale electronics distributor supplying smartphones, tablets, audio devices, displays, accessories, and liquidation inventory across Canada and the United States.",
  phoneDisplay: "+1 647 403 4735",
  phoneHref: "+16474034735",
  emails: {
    info: "info@marstechnologyinc.com",
    sales: "sales@marstechnologyinc.com",
    support: "support@marstechnologyinc.com",
    partners: "partners@marstechnologyinc.com",
  },
  canadaOffice: {
    streetAddress: "250 Sunny Meadow Blvd, Unit 248",
    addressLocality: "Brampton",
    addressRegion: "ON",
    postalCode: "L6R 3Y6",
    addressCountry: "CA",
  },
} as const;

type MetadataType = "website" | "article";

type BuildMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: MetadataType;
  image?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(
    path.startsWith("/") ? path : `/${path}`,
    siteConfig.url,
  ).toString();
}

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",
  image,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const images = image ? [absoluteUrl(image)] : undefined;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "en_US",
      type,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}
