import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "../styles/globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LDAP Manager",
  description: "Web-based LDAP management console",
};

const services = [
  { name: "openldap", label: "OpenLDAP" },
  { name: "powerdns", label: "PowerDNS" },
  { name: "freeradius", label: "FreeRADIUS" },
  { name: "asterisk", label: "Asterisk" },
  { name: "kerberos", label: "Kerberos" },
  { name: "netcrave", label: "Netcrave" },
  { name: "opendkim", label: "OpenDKIM" },
  { name: "sendmail", label: "Sendmail" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.className} ${ibmPlexMono.className}`}
    >
      <body>
        <div className="app-container">
          <aside className="sidebar">
            <h1 className="mb-8 text-xl font-bold text-gray-900">
              LDAP Manager
            </h1>
            <nav>
              {services.map((service) => (
                <a
                  key={service.name}
                  href={`/${service.name}`}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {service.label}
                </a>
              ))}
            </nav>
          </aside>
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
