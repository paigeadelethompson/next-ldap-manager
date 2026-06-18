'use client';

import { useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { UserForm } from '@/components/services/openldap/UserForm';
import { GroupForm } from '@/components/services/openldap/GroupForm';
import { OuForm } from '@/components/services/openldap/OuForm';
import { Card } from '@/components/ui/Card';
import { getServiceConfig } from '@/lib/services';

type EntryType = 'user' | 'group' | 'ou';

export default function NewEntryPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const entryType = (searchParams.get('entryType') as EntryType) || 'user';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdEntry, setCreatedEntry] = useState<any>(null);

  async function handleSubmit(data: any) {
    setCreatedEntry(data);
    setError(null);
    setLoading(true);

    try {
      router.push(`/${resolvedParams.service}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create entry');
    } finally {
      setLoading(false);
    }
  }

  const renderForm = () => {
    switch (entryType) {
      case 'user':
        return <UserForm onSubmit={handleSubmit} onCancel={() => router.push(`/${resolvedParams.service}`)} />;
      case 'group':
        return <GroupForm onSubmit={handleSubmit} onCancel={() => router.push(`/${resolvedParams.service}`)} />;
      case 'ou':
        return <OuForm onSubmit={handleSubmit} onCancel={() => router.push(`/${resolvedParams.service}`)} />;
    }
  };

  const serviceConfig = getServiceConfig(resolvedParams.service);

  if (createdEntry) {
    return (
      <div className="page-wrapper">
        <Card title={`Successfully Created ${entryType.charAt(0).toUpperCase() + entryType.slice(1)}`}>
          <div className="card-content">
            <p className="text-green-600 mb-4">The {entryType} was created successfully!</p>
            <div className="space-y-2 text-sm">
              <p><strong>DN:</strong> {createdEntry.dn}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Form Card */}
      <Card title={`Create New ${entryType.charAt(0).toUpperCase() + entryType.slice(1)}`}>
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}
        <div className="card-content">
          {renderForm()}
        </div>
        <div className="action-buttons">
          <Button variant="secondary" onClick={() => router.push(`/${resolvedParams.service}`)}>
            Cancel
          </Button>
          <Button type="button" disabled={loading} onClick={() => {
            setLoading(true);
            setError('Please fill out the form and submit it');
            setTimeout(() => setLoading(false), 1000);
          }}>
            {loading ? 'Creating...' : `Create ${entryType.charAt(0).toUpperCase() + entryType.slice(1)}`}
          </Button>
        </div>
      </Card>
    </div>
  );
}
