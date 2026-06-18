'use client';

import { useState } from 'react';
import { graphqlRequest } from '@/lib/graphql/client';
import { CREATE_POWERDNS_RECORD_MUTATION, UPDATE_POWERDNS_RECORD_MUTATION } from '@/lib/graphql/powerdns';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface RecordFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function RecordForm({ onSubmit, onCancel, initialData }: RecordFormProps) {
  const [formData, setFormData] = useState({
    zoneName: initialData?.zoneName || '',
    name: initialData?.name || '',
    type: initialData?.type || 'A',
    ttl: initialData?.ttl ? String(initialData.ttl) : '86400',
    priority: initialData?.priority ? String(initialData.priority) : '',
    content: initialData?.content || '',
    disabled: initialData?.disabled !== undefined ? (initialData.disabled ? 'true' : 'false') : 'false',
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
        query: initialData ? UPDATE_POWERDNS_RECORD_MUTATION : CREATE_POWERDNS_RECORD_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            zoneName: formData.zoneName,
            name: formData.name,
            type: formData.type,
            ttl: formData.ttl ? parseInt(formData.ttl, 10) : undefined,
            priority: formData.priority ? parseInt(formData.priority, 10) : undefined,
            content: formData.content,
            disabled: formData.disabled === 'true',
          },
        },
      });

      onSubmit(response[initialData ? 'updatePowerdnsRecord' : 'createPowerdnsRecord']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save record');
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
        <div className="grid grid-cols-2 gap-6">
          <FormField label="Zone Name" required description="Parent zone for the record (e.g., example.com)">
            <Input
              name="zoneName"
              value={formData.zoneName}
              onChange={handleChange}
              placeholder="example.com"
              required
            />
          </FormField>

          <FormField label="Record Name" required>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="@ or host.example.com"
              required
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Type" required>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="A">A</option>
              <option value="AAAA">AAAA</option>
              <option value="CNAME">CNAME</option>
              <option value="MX">MX</option>
              <option value="NS">NS</option>
              <option value="PTR">PTR</option>
              <option value="SOA">SOA</option>
              <option value="TXT">TXT</option>
              <option value="SRV">SRV</option>
              <option value="CAA">CAA</option>
              <option value="DNSKEY">DNSKEY</option>
            </select>
          </FormField>

          <FormField label="TTL (seconds)">
            <Input
              name="ttl"
              type="number"
              value={formData.ttl}
              onChange={handleChange}
              placeholder="86400"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {['MX', 'SRV'].includes(formData.type) && (
            <FormField label="Priority">
              <Input
                name="priority"
                type="number"
                value={formData.priority}
                onChange={handleChange}
                placeholder="10"
              />
            </FormField>
          )}

          <FormField label="Disabled">
            <select
              name="disabled"
              value={formData.disabled}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </FormField>
        </div>

        <FormField label="Content" required>
          <Input
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="192.168.1.1 or mail.example.com"
            required
          />
        </FormField>
      </div>
    </div>
  );
}
