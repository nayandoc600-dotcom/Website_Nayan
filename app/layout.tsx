import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nayan Educational Consultancy",
    template: "%s | Nayan Educational Consultancy",
  },
  description:
    "Nayan Educational Consultancy helps students in Nepal pursue their study-abroad goals with clarity and confidence.",
  metadataBase: new URL("https://www.nayanedu.com"),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nayan Educational Consultancy",
  url: "https://www.nayanedu.com",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Nayan Educational Consultancy",
  url: "https://www.nayanedu.com",
  description:
    "Nayan Educational Consultancy helps students in Nepal pursue their study-abroad goals with clarity and confidence.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Minbhawan, near Civil Hospital",
    addressLocality: "Kathmandu",
    addressCountry: "NP",
  },
  email: "info@nayanedu.com",
  telephone: "+977-1-4797183",
  foundingDate: "2014",
  sameAs: ["https://www.facebook.com/nayan.education"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
