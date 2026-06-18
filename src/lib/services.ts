export type EntryType = 'user' | 'group' | 'ou' | 'record' | 'zone' | 'extension' | 'trunk' | 'principal' | 'realm' | 'domain' | 'key' | 'alias';

export interface ServiceConfig {
  name: string;
  label: string;
  entryTypes: EntryType[];
}

export const SERVICES: Record<string, ServiceConfig> = {
  openldap: {
    name: 'openldap',
    label: 'OpenLDAP',
    entryTypes: ['user', 'group', 'ou'],
  },
  powerdns: {
    name: 'powerdns',
    label: 'PowerDNS',
    entryTypes: ['zone', 'record'],
  },
  freeradius: {
    name: 'freeradius',
    label: 'FreeRADIUS',
    entryTypes: ['user', 'group'],
  },
  asterisk: {
    name: 'asterisk',
    label: 'Asterisk',
    entryTypes: ['extension', 'trunk'],
  },
  kerberos: {
    name: 'kerberos',
    label: 'Kerberos',
    entryTypes: ['principal', 'realm'],
  },
  netcrave: {
    name: 'netcrave',
    label: 'Netcrave',
    entryTypes: ['user', 'group'],
  },
  opendkim: {
    name: 'opendkim',
    label: 'OpenDKIM',
    entryTypes: ['domain', 'key'],
  },
  sendmail: {
    name: 'sendmail',
    label: 'Sendmail',
    entryTypes: ['user', 'alias'],
  },
};

export function getServiceConfig(serviceName: string): ServiceConfig {
  return SERVICES[serviceName.toLowerCase()] || {
    name: serviceName.toLowerCase(),
    label: serviceName.charAt(0).toUpperCase() + serviceName.slice(1),
    entryTypes: ['user', 'group', 'ou'],
  };
}
