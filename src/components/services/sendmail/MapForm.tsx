'use client';

import { useState } from 'react';
import { graphqlRequest, CREATE_SENDMAIL_MAP_MUTATION, UPDATE_SENDMAIL_MAP_MUTATION } from '@/lib/graphql/client';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface MapFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function MapForm({ onSubmit, onCancel, initialData }: MapFormProps) {
  const [formData, setFormData] = useState({
    mapName: initialData?.mapName || '',
    key: initialData?.key || '',
    value: initialData?.value || '',
    description: initialData?.description || '',
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
        query: initialData ? UPDATE_SENDMAIL_MAP_MUTATION : CREATE_SENDMAIL_MAP_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            mapName: formData.mapName,
            key: formData.key,
            value: formData.value,
            description: formData.description,
          },
        },
      });

      onSubmit(response[initialData ? 'updateSendmailMap' : 'createSendmailMap']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save map entry');
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
        <FormField label="Map Name" required description="Name of the sendmail map (e.g., relay-domains)">
          <Input
            name="mapName"
            value={formData.mapName}
            onChange={handleChange}
            placeholder="relay-domains"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Key" required>
            <Input
              name="key"
              value={formData.key}
              onChange={handleChange}
              placeholder="example.com"
              required
            />
          </FormField>

          <FormField label="Value" required>
            <Input
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="OK"
              required
            />
          </FormField>
        </div>

        <FormField label="Description">
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Allow relaying for this domain"
          />
        </FormField>
      </div>
    </div>
  );
}
