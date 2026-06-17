import { useEffect, useState, useCallback } from 'react';
import { ldapClientPool, LDAPClient } from '@/lib/ldap/client';
import { LdapConfig, SearchResult, EntryFilter } from '@/lib/types';

// Get LDAP config from environment
function getLdapConfig(): LdapConfig {
  return {
    url: process.env.LDAP_URL || 'ldaps://localhost',
    bindDN: process.env.LDAP_BIND_DN || '',
    bindPassword: process.env.LDAP_BIND_PASSWORD || '',
    tlsRejectUnauthorized: process.env.LDAP_TLS_REJECT_UNAUTHORIZED !== 'false',
  };
}

export function useLdapClient() {
  const [client, setClient] = useState<LDAPClient | null>(null);
  const [config] = useState<LdapConfig>(getLdapConfig());

  useEffect(() => {
    const clientInstance = ldapClientPool.getClient(config);
    setClient(clientInstance);

    return () => {
      // Client is managed by pool, don't close it here
    };
  }, []);

  return client;
}

export function useSearch<T = Record<string, unknown>>(filter: EntryFilter) {
  const client = useLdapClient();
  const [entries, setEntries] = useState<SearchResult<T>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (!client) return;

    setLoading(true);
    setError(null);

    try {
      const results = await client.search<T>(filter);
      setEntries(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [client, filter]);

  useEffect(() => {
    search();
  }, [search]);

  return { entries, loading, error, refresh: search };
}

export function useLdapOperation() {
  const client = useLdapClient();

  const addEntry = useCallback(
    async (dn: string, attributes: Record<string, unknown>) => {
      if (!client) throw new Error('LDAP client not available');

      await client.add(dn, attributes);
      return { success: true, entryDn: dn };
    },
    [client]
  );

  const modifyEntry = useCallback(
    async (
      dn: string,
      changes: { attribute: string; values: unknown[]; operation: 'add' | 'replace' | 'delete' }[]
    ) => {
      if (!client) throw new Error('LDAP client not available');

      await client.modify(dn, changes);
      return { success: true, changedAttributes: changes.map((c) => c.attribute) };
    },
    [client]
  );

  const deleteEntry = useCallback(
    async (dn: string) => {
      if (!client) throw new Error('LDAP client not available');

      await client.delete(dn);
      return { success: true, message: `Deleted ${dn}` };
    },
    [client]
  );

  return { addEntry, modifyEntry, deleteEntry };
}
