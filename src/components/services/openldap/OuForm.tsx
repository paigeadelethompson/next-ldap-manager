'use client';

import { useState } from 'react';
import { graphqlRequest, CREATE_OU_MUTATION } from '@/lib/graphql/client';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface OuFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function OuForm({ onSubmit, onCancel, initialData }: OuFormProps) {
  const [formData, setFormData] = useState({
    ou: initialData?.ou || '',
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
        query: CREATE_OU_MUTATION,
        variables: {
          input: formData,
        },
      });

      onSubmit(response.createOpenLdapOu);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create OU');
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
        <FormField label="OU Name" required description="Name of the organizational unit">
          <Input
            name="ou"
            value={formData.ou}
            onChange={handleChange}
            placeholder="Engineering"
            required
          />
        </FormField>

        <FormField label="Description">
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Engineering department"
          />
        </FormField>
      </div>
    </div>
  );
}
