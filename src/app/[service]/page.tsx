'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

type EntryType = 'user' | 'group' | 'ou';

interface ServiceEntry {
  dn: string;
  attributes: Record<string, unknown>;
}

interface OpenLdapUser {
  dn: string;
  cn: string;
  uid?: string;
  mail?: string;
}

interface OpenLdapGroup {
  dn: string;
  cn: string;
  gidNumber?: number;
  memberUid?: string[];
}

interface OpenLdapOu {
  dn: string;
  ou: string;
  description?: string;
}

const OpenLDAPEntryTypes = ['user', 'group', 'ou'] as const;

export default function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EntryType>('user');
  const [entries, setEntries] = useState<ServiceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEntries() {
      try {
        // In a real implementation, this would make a GraphQL query
        setEntries([]);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entries');
        setLoading(false);
      }
    }

    fetchEntries();
  }, [resolvedParams.service]);

  const getUserTableColumns = () => [
    { header: 'DN', key: 'dn' },
    { header: 'Common Name', key: 'cn' },
    { header: 'UID', key: 'uid' },
    { header: 'Email', key: 'mail' },
  ];

  const getGroupTableColumns = () => [
    { header: 'DN', key: 'dn' },
    { header: 'Name', key: 'cn' },
    { header: 'GID', key: 'gidNumber' },
    { header: 'Members', key: 'memberUid' },
  ];

  const getOuTableColumns = () => [
    { header: 'DN', key: 'dn' },
    { header: 'OU Name', key: 'ou' },
    { header: 'Description', key: 'description' },
  ];

  const renderEntriesTable = (entries: ServiceEntry[], columns: { header: string; key: string }[]) => {
    if (entries.length === 0) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">No entries found.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, idx) => (
            <TableRow key={entry.dn}>
              <TableCell className="font-medium">{entry.dn}</TableCell>
              {columns.slice(1).map((col) => {
                const value = (entry.attributes as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${entry.dn}-${col.key}`}>
                    {Array.isArray(value)
                      ? value.join(', ')
                      : typeof value === 'object'
                      ? JSON.stringify(value)
                      : String(value ?? '')}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const getUserEntries = (): ServiceEntry[] => {
    return entries.map((e) => ({
      dn: e.dn,
      attributes: {
        cn: (e.attributes.cn as string) || '',
        uid: e.attributes.uid as string | undefined,
        mail: e.attributes.mail as string | undefined,
        ...e.attributes,
      },
    }));
  };

  const getGroupEntries = (): ServiceEntry[] => {
    return entries.map((e) => ({
      dn: e.dn,
      attributes: {
        cn: (e.attributes.cn as string) || '',
        gidNumber: Number(e.attributes.gidNumber),
        memberUid: Array.isArray(e.attributes.memberUid)
          ? (e.attributes.memberUid as string[])
          : e.attributes.memberUid
          ? [String(e.attributes.memberUid)]
          : [],
        ...e.attributes,
      },
    }));
  };

  const getOuEntries = (): ServiceEntry[] => {
    return entries.map((e) => ({
      dn: e.dn,
      attributes: {
        ou: (e.attributes.ou as string) || '',
        description: e.attributes.description as string | undefined,
        ...e.attributes,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">{resolvedParams.service}</h1>
          <Button onClick={() => router.push(`/${resolvedParams.service}/new`)}>
            + Create Entry
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {OpenLDAPEntryTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                  ${activeTab === type
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {type}s
              </button>
            ))}
          </nav>
        </div>

        {/* Entries Table */}
        <Card>
          {loading ? (
            <Loading />
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : activeTab === 'user' ? (
            renderEntriesTable(getUserEntries(), getUserTableColumns())
          ) : activeTab === 'group' ? (
            renderEntriesTable(getGroupEntries(), getGroupTableColumns())
          ) : (
            renderEntriesTable(getOuEntries(), getOuTableColumns())
          )}
        </Card>
      </main>
    </div>
  );
}
