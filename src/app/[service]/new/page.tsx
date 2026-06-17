'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { UserForm } from '@/components/services/openldap/UserForm';
import { GroupForm } from '@/components/services/openldap/GroupForm';
import { OuForm } from '@/components/services/openldap/OuForm';
import { FormField } from '@/components/ui/FormField';
import { Card } from '@/components/ui/Card';

type EntryType = 'user' | 'group' | 'ou';

export default function NewEntryPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [entryType, setEntryType] = useState<EntryType>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would submit to GraphQL
      await new Promise((resolve) => setTimeout(resolve, 100));

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
        return <UserForm onSubmit={() => {}} onCancel={() => {}} />;
      case 'group':
        return <GroupForm onSubmit={() => {}} onCancel={() => {}} />;
      case 'ou':
        return <OuForm onSubmit={() => {}} onCancel={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">{resolvedParams.service}</h1>
          <Button variant="secondary" onClick={() => router.push(`/${resolvedParams.service}`)}>
            Back to List
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card title={`Create New ${resolvedParams.service} Entry`}>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Entry Type Selector */}
          <FormField label="Entry Type" required>
            <Select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as EntryType)}
              options={[
                { value: 'user', label: 'User' },
                { value: 'group', label: 'Group' },
                { value: 'ou', label: 'Organizational Unit' },
              ]}
            />
          </FormField>

          <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t border-gray-200 mt-6">
            {renderForm()}

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button variant="secondary" onClick={() => router.push(`/${resolvedParams.service}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : `Create ${entryType.charAt(0).toUpperCase() + entryType.slice(1)}`}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
