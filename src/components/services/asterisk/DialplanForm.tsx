'use client';

import { useState } from 'react';
import { graphqlRequest, CREATE_ASTERISK_DIALPLAN_MUTATION, UPDATE_ASTERISK_DIALPLAN_MUTATION } from '@/lib/graphql/client';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface DialplanFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function DialplanForm({ onSubmit, onCancel, initialData }: DialplanFormProps) {
  const [formData, setFormData] = useState({
    context: initialData?.context || 'default',
    exten: initialData?.exten || '',
    priority: initialData?.priority ? String(initialData.priority) : '1',
    appname: initialData?.appname || '',
    appdata: initialData?.appdata || '',
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
        query: initialData ? UPDATE_ASTERISK_DIALPLAN_MUTATION : CREATE_ASTERISK_DIALPLAN_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            context: formData.context,
            exten: formData.exten,
            priority: parseInt(formData.priority, 10),
            appname: formData.appname,
            appdata: formData.appdata,
          },
        },
      });

      onSubmit(response[initialData ? 'updateAsteriskDialplan' : 'createAsteriskDialplan']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save dialplan');
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
        <div className="grid grid-cols-3 gap-6">
          <FormField label="Context" required>
            <Input
              name="context"
              value={formData.context}
              onChange={handleChange}
              placeholder="default"
              required
            />
          </FormField>

          <FormField label="Extension" required>
            <Input
              name="exten"
              value={formData.exten}
              onChange={handleChange}
              placeholder="1000"
              required
            />
          </FormField>

          <FormField label="Priority" required>
            <Input
              name="priority"
              type="number"
              value={formData.priority}
              onChange={handleChange}
              placeholder="1"
              required
            />
          </FormField>
        </div>

        <FormField label="Application Name" required>
          <Input
            name="appname"
            value={formData.appname}
            onChange={handleChange}
            placeholder="Dial"
            required
          />
        </FormField>

        <FormField label="Application Data">
          <Input
            name="appdata"
            value={formData.appdata}
            onChange={handleChange}
            placeholder="SIP/1000"
          />
        </FormField>
      </div>
    </div>
  );
}
