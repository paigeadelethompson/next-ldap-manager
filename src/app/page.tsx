'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';

const services = [
  {
    id: 'asterisk',
    name: 'Asterisk',
    description: 'SIP PBX management',
  },
  {
    id: 'freeradius',
    name: 'FreeRADIUS',
    description: 'Network access authentication',
  },
  {
    id: 'krb5',
    name: 'Kerberos',
    description: 'Kerberos realm management',
  },
  {
    id: 'netcrave',
    name: 'Netcrave',
    description: 'Certificate authority',
  },
  {
    id: 'opendkim',
    name: 'OpenDKIM',
    description: 'Email signing',
  },
  {
    id: 'openldap',
    name: 'OpenLDAP',
    description: 'Generic LDAP entries',
  },
  {
    id: 'powerdns',
    name: 'PowerDNS',
    description: 'DNS zone management',
  },
  {
    id: 'sendmail',
    name: 'Sendmail',
    description: 'Mail routing',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">LDAP Manager</h1>
          <p className="mt-1 text-sm text-gray-500">
            Multi-service LDAP administration console
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/${service.id}`}
                className="block"
              >
                <Card className="h-full hover:border-blue-500 transition-colors cursor-pointer">
                  <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-blue-50 border border-blue-100 rounded-lg p-6">
          <h2 className="text-lg font-medium text-blue-900 mb-2">Getting Started</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
            <li>Configure your LDAP connection in .env file</li>
            <li>Select a service from the menu above</li>
            <li>Create new entries or edit existing ones</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
