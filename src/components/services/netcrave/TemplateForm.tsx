'use client';

import { useState } from 'react';
import { graphqlRequest } from '@/lib/graphql/client';
import { CREATE_NETCRAVE_TEMPLATE_MUTATION, UPDATE_NETCRAVE_TEMPLATE_MUTATION } from '@/lib/graphql/netcrave';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface TemplateFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function TemplateForm({ onSubmit, onCancel, initialData }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    subject: initialData?.subject || '/CN=certificate',
    keyType: initialData?.keyType || 'RSA',
    keySize: initialData?.keySize ? String(initialData.keySize) : '2048',
    validityDays: initialData?.validityDays ? String(initialData.validityDays) : '365',
    extensions: initialData?.extensions ? JSON.stringify(initialData.extensions, null, 2) : '',
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

  function handleTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
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
      let extensions = undefined;
      if (formData.extensions.trim()) {
        try {
          extensions = JSON.parse(formData.extensions);
        } catch (err) {
          throw new Error('Invalid JSON in extensions field');
        }
      }

      const response = await graphqlRequest({
        query: initialData ? UPDATE_NETCRAVE_TEMPLATE_MUTATION : CREATE_NETCRAVE_TEMPLATE_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            name: formData.name,
            description: formData.description,
            subject: formData.subject,
            keyType: formData.keyType,
            keySize: formData.keySize ? parseInt(formData.keySize, 10) : undefined,
            validityDays: formData.validityDays ? parseInt(formData.validityDays, 10) : undefined,
            extensions,
          },
        },
      });

      onSubmit(response[initialData ? 'updateNetcraveTemplate' : 'createNetcraveTemplate']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
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
        <FormField label="Template Name" required description="Name of the certificate template">
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="server-cert"
            required
          />
        </FormField>

        <FormField label="Description">
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Server certificate template"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Subject DN">
            <Input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="/CN=certificate"
            />
          </FormField>

          <FormField label="Key Type">
            <select
              name="keyType"
              value={formData.keyType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="RSA">RSA</option>
              <option value="EC">EC (Elliptic Curve)</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Key Size">
            <Input
              name="keySize"
              type="number"
              value={formData.keySize}
              onChange={handleChange}
              placeholder="2048"
            />
          </FormField>

          <FormField label="Validity Days">
            <Input
              name="validityDays"
              type="number"
              value={formData.validityDays}
              onChange={handleChange}
              placeholder="365"
            />
          </FormField>
        </div>

        <FormField label="Extensions (JSON)">
          <textarea
            name="extensions"
            value={formData.extensions}
            onChange={handleTextAreaChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 font-mono text-sm"
            rows={5}
            placeholder='{"basicConstraints": "CA:FALSE", "keyUsage": "digitalSignature,keyEncipherment"}'
          />
        </FormField>
      </div>
    </div>
  );
}
