'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface GroupFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function GroupForm({ onSubmit, onCancel, initialData }: GroupFormProps) {
  const [formData, setFormData] = useState({
    cn: initialData?.cn || '',
    gidNumber: initialData?.gidNumber ? String(initialData.gidNumber) : '',
    memberUid: (initialData?.memberUid as string[])?.join(',') || '',
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
    <Card title="Group Information">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <FormField label="Group Name (cn)" required description="Name of the group">
          <Input
            name="cn"
            value={formData.cn}
            onChange={handleChange}
            placeholder="developers"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="GID Number" description="Group ID (auto-assigned if empty)">
            <Input
              name="gidNumber"
              value={formData.gidNumber}
              onChange={handleChange}
              type="number"
              placeholder="1000"
            />
          </FormField>
        </div>

        <FormField label="Members (comma-separated UIDs)" description="User IDs belonging to this group">
          <Input
            name="memberUid"
            value={formData.memberUid}
            onChange={handleChange}
            placeholder="jdoe,asmith,jbrown"
          />
        </FormField>

        <FormField label="Description">
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Development team"
          />
        </FormField>

        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={() => onSubmit(formData)}>
            {initialData ? 'Update Group' : 'Create Group'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
