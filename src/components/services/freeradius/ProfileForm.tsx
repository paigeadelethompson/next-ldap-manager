'use client';

import { useState } from 'react';
import { graphqlRequest } from '@/lib/graphql/client';
import { CREATE_FREERADIUS_PROFILE_MUTATION, UPDATE_FREERADIUS_PROFILE_MUTATION } from '@/lib/graphql/freeradius';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface ProfileFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function ProfileForm({ onSubmit, onCancel, initialData }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    attributes: initialData?.attributes ? JSON.stringify(initialData.attributes, null, 2) : '',
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
      // Parse attributes JSON if provided
      let attributes = undefined;
      if (formData.attributes.trim()) {
        try {
          attributes = JSON.parse(formData.attributes);
        } catch (err) {
          throw new Error('Invalid JSON in attributes field');
        }
      }

      const response = await graphqlRequest({
        query: initialData ? UPDATE_FREERADIUS_PROFILE_MUTATION : CREATE_FREERADIUS_PROFILE_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            name: formData.name,
            description: formData.description,
            attributes,
          },
        },
      });

      onSubmit(response[initialData ? 'updateFreeradiusProfile' : 'createFreeradiusProfile']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
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
        <FormField label="Profile Name" required description="Name of the Radius profile">
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="default-profile"
            required
          />
        </FormField>

        <FormField label="Description">
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Default user profile"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <FormField label="Attributes (JSON)" description="Radius attributes in JSON format">
              <textarea
                name="attributes"
                value={formData.attributes}
                onChange={handleTextAreaChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 font-mono text-sm"
                rows={8}
                placeholder='{"Tunnel-Type": "VLAN", "Tunnel-Medium-Type": "IEEE-802", "Tunnel-Private-Group-ID": "100"}'
              />
            </FormField>
          </div>
        </div>
      </div>
    </div>
  );
}
