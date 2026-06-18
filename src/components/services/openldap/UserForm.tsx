"use client";

import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql/client";
import { CREATE_USER_MUTATION } from "@/lib/graphql/openldap";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

interface UserFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function UserForm({ onSubmit, onCancel, initialData }: UserFormProps) {
  const [formData, setFormData] = useState({
    cn: initialData?.cn || "",
    uid: initialData?.uid || "",
    mail: initialData?.mail || "",
    userPassword: "",
    givenName: initialData?.givenName || "",
    sn: initialData?.sn || "",
    telephoneNumber: initialData?.telephoneNumber || "",
    title: initialData?.title || "",
    ou: initialData?.ou || "",
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
        query: CREATE_USER_MUTATION,
        variables: {
          input: formData,
        },
      });

      onSubmit(response.createOpenLdapUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="space-y-6">
          <FormField
            label="Common Name (cn)"
            required
            description="User's display name"
          >
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

            <FormField
              label="Organizational Unit"
              description="User's department/group"
            >
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
        </div>

        <div className="action-buttons mt-6">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </div>
  );
}
