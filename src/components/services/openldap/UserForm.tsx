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
    uidNumber: initialData?.uidNumber ? String(initialData.uidNumber) : "",
    gidNumber: initialData?.gidNumber ? String(initialData.gidNumber) : "",
    homeDirectory: initialData?.homeDirectory || "",
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
      const submitData: Record<string, any> = { ...formData };

      // Convert numeric fields only if they have values
      if (submitData.uidNumber) {
        submitData.uidNumber = parseInt(submitData.uidNumber, 10);
      } else {
        delete submitData.uidNumber;
      }

      if (submitData.gidNumber) {
        submitData.gidNumber = parseInt(submitData.gidNumber, 10);
      } else {
        delete submitData.gidNumber;
      }

      if (!submitData.homeDirectory) {
        delete submitData.homeDirectory;
      }

      const response = await graphqlRequest({
        query: CREATE_USER_MUTATION,
        variables: {
          input: submitData,
        },
      });

      onSubmit(submitData);
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
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Basic Information
            </h3>

            <FormField
              label="Common Name"
              required
              description="Full name of the user"
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
              <FormField label="Username" description="Login identifier (UID)">
                <Input
                  name="uid"
                  value={formData.uid}
                  onChange={handleChange}
                  placeholder="jdoe"
                />
              </FormField>

              <FormField label="Email" type="email">
                <Input
                  name="mail"
                  value={formData.mail}
                  onChange={handleChange}
                  type="email"
                  placeholder="john.doe@example.com"
                />
              </FormField>
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Personal Details
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <FormField label="First Name" description="Given name">
                <Input
                  name="givenName"
                  value={formData.givenName}
                  onChange={handleChange}
                  placeholder="John"
                />
              </FormField>

              <FormField label="Last Name" description="Family surname">
                <Input
                  name="sn"
                  value={formData.sn}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </FormField>
            </div>

            <FormField label="Phone Number">
              <Input
                name="telephoneNumber"
                value={formData.telephoneNumber}
                onChange={handleChange}
                placeholder="+1-555-1234"
              />
            </FormField>

            <FormField label="Job Title">
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Software Engineer"
              />
            </FormField>
          </div>

          {/* Organizational */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Organizational
            </h3>

            <FormField
              label="Department / OU"
              description="Organizational Unit"
            >
              <Input
                name="ou"
                value={formData.ou}
                onChange={handleChange}
                placeholder="Engineering"
              />
            </FormField>
          </div>

          {/* Credentials */}
          {!initialData && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Credentials</h3>

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
            </div>
          )}

          {/* POSIX Account Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">POSIX Account</h3>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                label="UID Number"
                description="User ID (auto-assigned if empty)"
              >
                <Input
                  name="uidNumber"
                  type="number"
                  value={formData.uidNumber}
                  onChange={handleChange}
                  placeholder="1000"
                />
              </FormField>

              <FormField
                label="GID Number"
                description="Primary Group ID (auto-assigned if empty)"
              >
                <Input
                  name="gidNumber"
                  type="number"
                  value={formData.gidNumber}
                  onChange={handleChange}
                  placeholder="1000"
                />
              </FormField>
            </div>

            <FormField label="Home Directory">
              <Input
                name="homeDirectory"
                value={formData.homeDirectory}
                onChange={handleChange}
                placeholder="/home/username"
              />
            </FormField>
          </div>
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
