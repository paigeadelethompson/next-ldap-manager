'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { getServiceConfig } from '@/lib/services';
import { graphqlRequest } from '@/lib/graphql/client';

type EntryType = 'user' | 'group' | 'ou' | 'record' | 'zone' | 'extension' | 'trunk' | 'principal' | 'realm' | 'domain' | 'key' | 'alias';

interface ServiceEntry {
  dn: string;
  attributes: Record<string, unknown>;
}

// GraphQL query for fetching entries
const FETCH_ENTRIES_QUERY = `
  query($baseDN: String!, $filter: String) {
    ldapEntries(baseDN: $baseDN, filter: $filter, scope: "subtree", attributes: ["*"]) {
      dn
      attributes
    }
  }
`;

export default function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const serviceConfig = getServiceConfig(resolvedParams.service);

  const [entries, setEntries] = useState<ServiceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true);
      setError(null);

      try {
        const baseDN = process.env.LDAP_BASE_DN || 'dc=netcrave,dc=local';

        // Determine filter based on service
        let filter = '(objectClass=*)';
        if (resolvedParams.service === 'openldap') {
          filter = '(objectClass=posixAccount)';
        }

        const result = await graphqlRequest({
          query: `
            query($baseDN: String!, $filter: String) {
              ldapEntries(baseDN: $baseDN, filter: $filter, scope: "subtree", attributes: ["*"]) {
                dn
                attributes
              }
            }
          `,
          variables: { baseDN, filter },
        });

        setEntries(result.ldapEntries || []);
      } catch (err) {
        console.error('Error fetching entries:', err);
        setError(err instanceof Error ? err.message : 'Failed to load entries');
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [resolvedParams.service]);

  const renderEntriesTable = (entries: ServiceEntry[], columns: { header: string; key: string }[]) => {
    if (entries.length === 0) {
      return (
        <div className="py-16 text-center">
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

  const getTableColumns = (type: EntryType) => {
    switch (type) {
      case 'user':
        return [
          { header: 'DN', key: 'dn' },
          { header: 'Common Name', key: 'cn' },
          { header: 'UID', key: 'uid' },
          { header: 'Email', key: 'mail' },
        ];
      case 'group':
        return [
          { header: 'DN', key: 'dn' },
          { header: 'Name', key: 'cn' },
          { header: 'GID', key: 'gidNumber' },
          { header: 'Members', key: 'memberUid' },
        ];
      case 'ou':
        return [
          { header: 'DN', key: 'dn' },
          { header: 'OU Name', key: 'ou' },
          { header: 'Description', key: 'description' },
        ];
      default:
        return [
          { header: 'DN', key: 'dn' },
          { header: 'Name', key: 'name' },
          { header: 'Value', key: 'value' },
        ];
    }
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{serviceConfig.label}</h1>
          <p className="mt-1 text-sm text-gray-500">Manage {serviceConfig.label} entries</p>
        </div>
        <div className="flex gap-3">
          {serviceConfig.entryTypes.map((type) => (
            <Button key={type} variant="secondary" onClick={() => router.push(`/${resolvedParams.service}/new?entryType=${type}`)}>
              + Create {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </header>

      {/* Entries Table */}
      <Card>
        {loading ? (
          <Loading fullScreen text="Loading entries..." />
        ) : error ? (
          <div className="card-content">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          renderEntriesTable(entries, getTableColumns(serviceConfig.entryTypes[0]))
        )}
      </Card>
    </div>
  );
}
