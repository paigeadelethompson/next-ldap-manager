'use client';

import { useState } from 'react';
import { graphqlRequest } from '@/lib/graphql/client';
import { CREATE_SENDMAIL_ALIAS_MUTATION, UPDATE_SENDMAIL_ALIAS_MUTATION } from '@/lib/graphql/sendmail';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface AliasFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function AliasForm({ onSubmit, onCancel, initialData }: AliasFormProps) {
  const [formData, setFormData] = useState({
    maildrop: initialData?.maildrop || '',
    mail: initialData?.mail || '',
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
        query: initialData ? UPDATE_SENDMAIL_ALIAS_MUTATION : CREATE_SENDMAIL_ALIAS_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            maildrop: formData.maildrop,
            mail: formData.mail,
            description: formData.description,
          },
        },
      });

      onSubmit(response[initialData ? 'updateSendmailAlias' : 'createSendmailAlias']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save alias');
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
        <FormField label="Maildrop (Target)" required description="Where emails should be forwarded">
          <Input
            name="maildrop"
            value={formData.maildrop}
            onChange={handleChange}
            placeholder="/path/to/forward"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Email Address">
            <Input
              name="mail"
              type="email"
              value={formData.mail}
              onChange={handleChange}
              placeholder="user@example.com"
            />
          </FormField>

          <FormField label="Description">
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Forward to backup address"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
