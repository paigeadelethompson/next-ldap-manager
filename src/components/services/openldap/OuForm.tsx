'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  }

  return (
    <Card title="Organizational Unit">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
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

        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={() => onSubmit(formData)}>
            {initialData ? 'Update OU' : 'Create OU'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
