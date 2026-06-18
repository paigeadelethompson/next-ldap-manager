'use client';

import { useState } from 'react';
import { graphqlRequest, CREATE_FREERADIUS_NAS_MUTATION, UPDATE_FREERADIUS_NAS_MUTATION } from '@/lib/graphql/client';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

interface NASFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function NASForm({ onSubmit, onCancel, initialData }: NASFormProps) {
  const [formData, setFormData] = useState({
    nasname: initialData?.nasname || '',
    shortname: initialData?.shortname || '',
    type: initialData?.type || 'other',
    secret: initialData?.secret || '',
    description: initialData?.description || '',
    radiusclientid: initialData?.radiusclientid || '',
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
        query: initialData ? UPDATE_FREERADIUS_NAS_MUTATION : CREATE_FREERADIUS_NAS_MUTATION,
        variables: {
          nasname: initialData?.nasname,
          input: {
            nasname: formData.nasname,
            shortname: formData.shortname,
            type: formData.type,
            secret: formData.secret,
            description: formData.description,
            radiusclientid: formData.radiusclientid,
          },
        },
      });

      onSubmit(response[initialData ? 'updateFreeradiusNas' : 'createFreeradiusNas']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save NAS');
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
        <FormField label="NAS Name" required description="IP address or hostname of the NAS">
          <Input
            name="nasname"
            value={formData.nasname}
            onChange={handleChange}
            placeholder="192.168.1.100"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Short Name">
            <Input
              name="shortname"
              value={formData.shortname}
              onChange={handleChange}
              placeholder="office-ap"
            />
          </FormField>

          <FormField label="Type">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="other">Other</option>
              <option value="cisco">Cisco</option>
              <option value="lantronix">Lantronix</option>
              <option value="mikrotik">MikroTik</option>
              <option value="nokia">Nokia</option>
              <option value="juniper">Juniper</option>
              <option value="cisco-vpn3000">Cisco VPN 3000</option>
            </select>
          </FormField>
        </div>

        <FormField label="Secret" required description="Shared secret between NAS and RADIUS server">
          <Input
            name="secret"
            type="password"
            value={formData.secret}
            onChange={handleChange}
            placeholder="shared-secret"
            required
          />
        </FormField>

        <FormField label="Radius Client ID">
          <Input
            name="radiusclientid"
            value={formData.radiusclientid}
            onChange={handleChange}
            placeholder="radius-client-id"
          />
        </FormField>

        <FormField label="Description">
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Main office access point"
          />
        </FormField>
      </div>
    </div>
  );
}
