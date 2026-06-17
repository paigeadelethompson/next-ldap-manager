'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Card } from '@/components/ui/Card';

interface UserFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function UserForm({ onSubmit, onCancel, initialData }: UserFormProps) {
  const [formData, setFormData] = useState({
    cn: initialData?.cn || '',
    uid: initialData?.uid || '',
    mail: initialData?.mail || '',
    userPassword: '',
    givenName: initialData?.givenName || '',
    sn: initialData?.sn || '',
    telephoneNumber: initialData?.telephoneNumber || '',
    title: initialData?.title || '',
    ou: initialData?.ou || '',
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
    <Card title="User Information">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <FormField label="Common Name (cn)" required description="User's display name">
          <Input
            name="cn"
            value={formData.cn}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="UID" description="Login identifier">
            <Input
              name="uid"
              value={formData.uid}
              onChange={handleChange}
              placeholder="jdoe"
            />
          </FormField>

          <FormField label="Organizational Unit" description="User's department/group">
            <Input
              name="ou"
              value={formData.ou}
              onChange={handleChange}
              placeholder="Engineering"
            />
          </FormField>
        </div>

        <FormField label="Email Address">
          <Input
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            type="email"
            placeholder="john.doe@example.com"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Given Name">
            <Input
              name="givenName"
              value={formData.givenName}
              onChange={handleChange}
              placeholder="John"
            />
          </FormField>

          <FormField label="Surname (sn)">
            <Input
              name="sn"
              value={formData.sn}
              onChange={handleChange}
              placeholder="Doe"
            />
          </FormField>
        </div>

        <FormField label="Telephone Number">
          <Input
            name="telephoneNumber"
            value={formData.telephoneNumber}
            onChange={handleChange}
            placeholder="+1-555-1234"
          />
        </FormField>

        <FormField label="Title">
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Software Engineer"
          />
        </FormField>

        {!initialData && (
          <FormField label="Password" required>
            <Input
              name="userPassword"
              type="password"
              value={formData.userPassword}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </FormField>
        )}

        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={() => onSubmit(formData)}>
            {initialData ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
