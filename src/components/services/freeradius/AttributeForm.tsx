'use client';

import { useState } from 'react';
import { graphqlRequest } from '@/lib/graphql/client';
import { CREATE_FREERADIUS_ATTRIBUTE_MUTATION, UPDATE_FREERADIUS_ATTRIBUTE_MUTATION } from '@/lib/graphql/freeradius';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Select } from '@/components/ui/Select';

interface AttributeFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const OPERATORS = [
  { value: ':=', label: 'Assign (:=)' },
  { value: '+=', label: 'Add (+=)' },
  { value: '==', label: 'Match (==)' },
  { value: '!=', label: 'Not equal (!=)' },
  { value: '<', label: 'Less than (<)' },
  { value: '<=', label: 'Less or equal (<=)' },
  { value: '>', label: 'Greater than (>)' },
  { value: '>=', label: 'Greater or equal (>=)' },
];

export function AttributeForm({ onSubmit, onCancel, initialData }: AttributeFormProps) {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    attribute: initialData?.attribute || '',
    operator: initialData?.operator || ':=',
    value: initialData?.value || '',
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

  function handleSelectChange(name: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const response = await graphqlRequest({
        query: initialData ? UPDATE_FREERADIUS_ATTRIBUTE_MUTATION : CREATE_FREERADIUS_ATTRIBUTE_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            username: formData.username,
            attribute: formData.attribute,
            operator: formData.operator,
            value: formData.value,
          },
        },
      });

      onSubmit(response[initialData ? 'updateFreeradiusAttribute' : 'createFreeradiusAttribute']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save attribute');
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
        <FormField label="Username" required description="User this attribute applies to">
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="jdoe"
            required
          />
        </FormField>

        <div className="grid grid-cols-3 gap-6">
          <FormField label="Attribute" required>
            <Input
              name="attribute"
              value={formData.attribute}
              onChange={handleChange}
              placeholder="Simultaneous-Use"
              required
            />
          </FormField>

          <FormField label="Operator" required>
            <Select
              options={OPERATORS}
              value={formData.operator}
              onChange={(e) => handleSelectChange('operator', e.target.value)}
            />
          </FormField>

          <FormField label="Value" required>
            <Input
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="1"
              required
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
