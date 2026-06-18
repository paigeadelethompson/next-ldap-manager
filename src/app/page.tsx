'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';

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
    id: 'kerberos',
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

interface ServiceStats {
  users?: number;
  groups?: number;
  ou?: number;
}

export default function Home() {
  const [servicesWithStats, setServicesWithStats] = useState<(typeof services)[0] & { stats: ServiceStats; connected: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Mock data - in production this would query the GraphQL endpoint
        const stats: Record<string, ServiceStats> = {
          openldap: { users: 142, groups: 28, ou: 5 },
          powerdns: { records: 1250 },
          freeradius: { users: 350, groups: 12 },
        };

        const result = services.map((service) => ({
          ...service,
          stats: stats[service.id] || {},
          connected: Math.random() > 0.1, // Simulate connection status
        }));
        setServicesWithStats(result);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading fullScreen text="Loading dashboard..." />
      </div>
    );
  }

  const getStatusBadge = (connected: boolean) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {connected ? 'Connected' : 'Disconnected'}
    </span>
  );

  const getServiceStatItems = (stats: ServiceStats) => {
    return Object.entries(stats).map(([key, value]) => (
      <div key={key} className="text-sm">
        <span className="font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>{' '}
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
    ));
  };

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
        {/* Server Status */}
        <div className="mb-8 rounded-lg bg-blue-50 border border-blue-100 p-6">
          <h2 className="text-lg font-medium text-blue-900 mb-2">LDAP Server Status</h2>
          <p className="text-sm text-blue-700">
            Connection: <span className="font-semibold text-green-700">Active</span> |
            Host: <span className="font-mono text-gray-600">ldap.example.com:389</span> |
            Base DN: <span className="font-mono text-gray-600">dc=example,dc=com</span>
          </p>
        </div>

        {/* Services Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesWithStats.map((service) => (
              <Link
                key={service.id}
                href={`/${service.id}`}
                className="block"
              >
                <Card className="h-full hover:border-blue-500 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                    {getStatusBadge(service.connected)}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{service.description}</p>
                  {Object.keys(service.stats).length > 0 ? (
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Objects</h4>
                      <div className="space-y-1">
                        {getServiceStatItems(service.stats)}
                      </div>
                    </div>
                  ) : null}
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/openldap/new?entryType=user" className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors">
              <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Create New User</p>
                <p className="text-sm text-gray-500">Add a new LDAP user</p>
              </div>
            </Link>
            <Link href="/openldap/new?entryType=group" className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors">
              <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Create New Group</p>
                <p className="text-sm text-gray-500">Add a new LDAP group</p>
              </div>
            </Link>
            <Link href="/openldap/new?entryType=ou" className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors">
              <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Create OU</p>
                <p className="text-sm text-gray-500">Add a new organizational unit</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Getting Started */}
        <section className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-medium text-blue-900 mb-2">Getting Started</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
            <li>Configure your LDAP connection in .env file</li>
            <li>Select a service from the menu above to manage entries</li>
            <li>Create new entries or edit existing ones</li>
            <li>All operations are logged for audit purposes</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
