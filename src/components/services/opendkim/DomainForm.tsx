'use client';

import { useState } from 'react';
import { graphqlRequest } from '@/lib/graphql/client';
import { CREATE_OPENDKIM_DOMAIN_MUTATION, UPDATE_OPENDKIM_DOMAIN_MUTATION } from '@/lib/graphql/opendkim';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface DomainFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function DomainForm({ onSubmit, onCancel, initialData }: DomainFormProps) {
  const [formData, setFormData] = useState({
    domainName: initialData?.domainName || '',
    selector: initialData?.selector || 'default',
    keysign: initialData?.keysign || 'y',
    keyfile: initialData?.keyfile || '',
    iua: initialData?.iua || 'individual',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const response = await graphqlRequest({
        query: initialData ? UPDATE_OPENDKIM_DOMAIN_MUTATION : CREATE_OPENDKIM_DOMAIN_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            domainName: formData.domainName,
            selector: formData.selector,
            keysign: formData.keysign,
            keyfile: formData.keyfile,
            iua: formData.iua,
          },
        },
      });

      onSubmit(response[initialData ? 'updateOpenDkimDomain' : 'createOpenDkimDomain']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save domain');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-content">
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <FormField label="Domain Name" required description="Domain to sign for">
          <Input
            name="domainName"
            value={formData.domainName}
            onChange={handleChange}
            placeholder="example.com"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Selector">
            <Input
              name="selector"
              value={formData.selector}
              onChange={handleChange}
              placeholder="default"
            />
          </FormField>

          <FormField label="Key Sign Flag">
            <select
              name="keysign"
              value={formData.keysign}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="y">Yes (sign)</option>
              <option value="n">No (don't sign)</option>
              <option value="v">Verify only</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Key File">
            <Input
              name="keyfile"
              value={formData.keyfile}
              onChange={handleChange}
              placeholder="/etc/opendkim/keys/example.com/default.private"
            />
          </FormField>

          <FormField label="Identity Usage Agreement (IUA)">
            <select
              name="iua"
              value={formData.iua}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="individual">Individual</option>
              <option value="organization">Organization</option>
              <option value="both">Both</option>
            </select>
          </FormField>
        </div>
      </div>
    </div>
  );
}
