export type EntryType =
  | "user"
  | "group"
  | "ou"
  | "record"
  | "zone"
  | "extension"
  | "trunk"
  | "principal"
  | "realm"
  | "domain"
  | "key"
  | "alias"
  | "profile"
  | "nas"
  | "attribute"
  | "voicemail"
  | "sipAccount"
  | "iaxAccount"
  | "template"
  | "certificate"
  | "icapService"
  | "signingPolicy";

export interface ServiceConfig {
  name: string;
  label: string;
  entryTypes: EntryType[];
}

export const SERVICES: Record<string, ServiceConfig> = {
  openldap: {
    name: "openldap",
    label: "OpenLDAP",
    entryTypes: ["user", "group", "ou"],
  },
  powerdns: {
    name: "powerdns",
    label: "PowerDNS",
    entryTypes: ["zone", "record"],
  },
  freeradius: {
    name: "freeradius",
    label: "FreeRADIUS",
    entryTypes: ["profile", "nas", "attribute"],
  },
  asterisk: {
    name: "asterisk",
    label: "Asterisk",
    entryTypes: ["extension", "trunk", "voicemail", "sipAccount", "iaxAccount"],
  },
  kerberos: {
    name: "kerberos",
    label: "Kerberos",
    entryTypes: ["principal", "realm", "policy"],
  },
  netcrave: {
    name: "netcrave",
    label: "Netcrave",
    entryTypes: ["template", "certificate", "icapService"],
  },
  opendkim: {
    name: "opendkim",
    label: "OpenDKIM",
    entryTypes: ["domain", "key", "signingPolicy"],
  },
  sendmail: {
    name: "sendmail",
    label: "Sendmail",
    entryTypes: ["alias", "map", "class"],
  },
};

export function getServiceConfig(serviceName: string): ServiceConfig {
  return (
    SERVICES[serviceName.toLowerCase()] || {
      name: serviceName.toLowerCase(),
      label: serviceName.charAt(0).toUpperCase() + serviceName.slice(1),
      entryTypes: ["user", "group", "ou"],
    }
  );
}
