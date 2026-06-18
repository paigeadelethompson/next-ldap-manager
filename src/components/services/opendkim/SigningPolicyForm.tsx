'use client';

import { useState } from 'react';
import { graphqlRequest } from '@/lib/graphql/client';
import { CREATE_OPENDKIM_SIGNING_POLICY_MUTATION, UPDATE_OPENDKIM_SIGNING_POLICY_MUTATION } from '@/lib/graphql/opendkim';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface SigningPolicyFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function SigningPolicyForm({ onSubmit, onCancel, initialData }: SigningPolicyFormProps) {
  const [formData, setFormData] = useState({
    domain: initialData?.domain || '',
    selector: initialData?.selector || 'default',
    key: initialData?.key || '',
    canonic: initialData?.canonic || 'relaxed:relaxed',
    signAlgorithm: initialData?.signAlgorithm || 'rsa-sha256',
    subdomains: initialData?.subdomains !== undefined ? (initialData.subdomains ? 'true' : 'false') : 'false',
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
        query: initialData ? UPDATE_OPENDKIM_SIGNING_POLICY_MUTATION : CREATE_OPENDKIM_SIGNING_POLICY_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            domain: formData.domain,
            selector: formData.selector,
            key: formData.key,
            canonic: formData.canonic,
            signAlgorithm: formData.signAlgorithm,
            subdomains: formData.subdomains === 'true',
          },
        },
      });

      onSubmit(response[initialData ? 'updateOpenDkimSigningPolicy' : 'createOpenDkimSigningPolicy']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save signing policy');
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
        <FormField label="Domain" required description="Domain this policy applies to">
          <Input
            name="domain"
            value={formData.domain}
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

          <FormField label="Key">
            <Input
              name="key"
              value={formData.key}
              onChange={handleChange}
              placeholder="Enter key or leave blank for selector-based lookup"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Canonicalization">
            <Input
              name="canonic"
              value={formData.canonic}
              onChange={handleChange}
              placeholder="relaxed:relaxed"
            />
          </FormField>

          <FormField label="Signing Algorithm">
            <select
              name="signAlgorithm"
              value={formData.signAlgorithm}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="rsa-sha256">RSA-SHA256</option>
              <option value="rsa-sha1">RSA-SHA1</option>
            </select>
          </FormField>
        </div>

        <FormField label="Apply to Sub-Domains">
          <select
            name="subdomains"
            value={formData.subdomains}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </FormField>
      </div>
    </div>
  );
}
