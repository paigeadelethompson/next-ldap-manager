'use client';

import { useState } from 'react';
import { graphqlRequest, CREATE_KRB5_POLICY_MUTATION, UPDATE_KRB5_POLICY_MUTATION } from '@/lib/graphql/client';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface PolicyFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function PolicyForm({ onSubmit, onCancel, initialData }: PolicyFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    minPasswordLength: initialData?.minPasswordLength ? String(initialData.minPasswordLength) : '8',
    minPasswordAge: initialData?.minPasswordAge ? String(initialData.minPasswordAge) : '0',
    maxPasswordAge: initialData?.maxPasswordAge ? String(initialData.maxPasswordAge) : '7776000',
    passwordHistoryLength: initialData?.passwordHistoryLength ? String(initialData.passwordHistoryLength) : '5',
    lockoutDuration: initialData?.lockoutDuration ? String(initialData.lockoutDuration) : '600',
    failedAuthCount: initialData?.failedAuthCount ? String(initialData.failedAuthCount) : '5',
    resetAuthCount: initialData?.resetAuthCount ? String(initialData.resetAuthCount) : '3600',
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
        query: initialData ? UPDATE_KRB5_POLICY_MUTATION : CREATE_KRB5_POLICY_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            name: formData.name,
            minPasswordLength: formData.minPasswordLength ? parseInt(formData.minPasswordLength, 10) : undefined,
            minPasswordAge: formData.minPasswordAge ? parseInt(formData.minPasswordAge, 10) : undefined,
            maxPasswordAge: formData.maxPasswordAge ? parseInt(formData.maxPasswordAge, 10) : undefined,
            passwordHistoryLength: formData.passwordHistoryLength ? parseInt(formData.passwordHistoryLength, 10) : undefined,
            lockoutDuration: formData.lockoutDuration ? parseInt(formData.lockoutDuration, 10) : undefined,
            failedAuthCount: formData.failedAuthCount ? parseInt(formData.failedAuthCount, 10) : undefined,
            resetAuthCount: formData.resetAuthCount ? parseInt(formData.resetAuthCount, 10) : undefined,
          },
        },
      });

      onSubmit(response[initialData ? 'updateKrb5Policy' : 'createKrb5Policy']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save policy');
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
        <FormField label="Policy Name" required description="Name of the Kerberos policy">
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="default-policy"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Min Password Length">
            <Input
              name="minPasswordLength"
              type="number"
              value={formData.minPasswordLength}
              onChange={handleChange}
              placeholder="8"
            />
          </FormField>

          <FormField label="Min Password Age (seconds)">
            <Input
              name="minPasswordAge"
              type="number"
              value={formData.minPasswordAge}
              onChange={handleChange}
              placeholder="0"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Max Password Age (seconds)">
            <Input
              name="maxPasswordAge"
              type="number"
              value={formData.maxPasswordAge}
              onChange={handleChange}
              placeholder="7776000 (90 days)"
            />
          </FormField>

          <FormField label="Password History Length">
            <Input
              name="passwordHistoryLength"
              type="number"
              value={formData.passwordHistoryLength}
              onChange={handleChange}
              placeholder="5"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Lockout Duration (seconds)">
            <Input
              name="lockoutDuration"
              type="number"
              value={formData.lockoutDuration}
              onChange={handleChange}
              placeholder="600"
            />
          </FormField>

          <FormField label="Failed Auth Count to Lockout">
            <Input
              name="failedAuthCount"
              type="number"
              value={formData.failedAuthCount}
              onChange={handleChange}
              placeholder="5"
            />
          </FormField>
        </div>

        <FormField label="Reset Auth Count After (seconds)">
          <Input
            name="resetAuthCount"
            type="number"
            value={formData.resetAuthCount}
            onChange={handleChange}
            placeholder="3600"
          />
        </FormField>
      </div>
    </div>
  );
}
