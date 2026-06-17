'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';

interface ServiceEntry {
  dn: string;
  attributes: Record<string, unknown>;
}

export default function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
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

  if (loading) {
    return <Loading fullScreen text={`Loading ${resolvedParams.service} entries...`} />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
        <Button variant="secondary" onClick={() => router.refresh()}>
          Try Again
        </Button>
      </div>
    );
  }

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
        {entries.length === 0 ? (
          <Card>
            <p className="text-gray-500">No entries found.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.dn}>
                <h3 className="text-lg font-medium text-gray-900">{entry.dn}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {Object.entries(entry.attributes)
                    .slice(0, 3)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' | ')}
                  {Object.keys(entry.attributes).length > 3 && (
                    <span className="text-gray-400">...</span>
                  )}
                </p>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
