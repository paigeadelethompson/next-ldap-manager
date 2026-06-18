"use client";

import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  CREATE_KRB5_PRINCIPAL_MUTATION,
  UPDATE_KRB5_PRINCIPAL_MUTATION,
  RESET_KRB5_PRINCIPAL_PASSWORD_MUTATION,
} from "@/lib/graphql/krb5";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";

interface PrincipalFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function PrincipalForm({
  onSubmit,
  onCancel,
  initialData,
}: PrincipalFormProps) {
  const [formData, setFormData] = useState({
    principalName: initialData?.principalName || "",
    realm: initialData?.realm || "",
    password: "",
    flags: initialData?.flags ? JSON.stringify(initialData.flags, null, 2) : "",
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
      let flags = undefined;
      if (formData.flags.trim()) {
        try {
          flags = JSON.parse(formData.flags);
        } catch (err) {
          throw new Error("Invalid JSON in flags field");
        }
      }

      const response = await graphqlRequest({
        query: initialData
          ? UPDATE_KRB5_PRINCIPAL_MUTATION
          : CREATE_KRB5_PRINCIPAL_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            principalName: formData.principalName,
            realm: formData.realm,
            password: initialData ? undefined : formData.password,
            flags,
          },
        },
      });

      onSubmit(
        response[initialData ? "updateKrb5Principal" : "createKrb5Principal"],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save principal");
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
        <FormField
          label="Principal Name"
          required
          description="Principal name (e.g., user@EXAMPLE.COM)"
        >
          <Input
            name="principalName"
            value={formData.principalName}
            onChange={handleChange}
            placeholder="user@EXAMPLE.COM"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Realm">
            <Input
              name="realm"
              value={formData.realm}
              onChange={handleChange}
              placeholder="EXAMPLE.COM"
            />
          </FormField>
        </div>

        {!initialData && (
          <FormField label="Initial Password" required>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter initial password"
              required
            />
          </FormField>
        )}

        <FormField label="Flags (JSON)">
          <textarea
            name="flags"
            value={formData.flags}
            onChange={handleTextAreaChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 font-mono text-sm"
            rows={3}
            placeholder='["PREAUTH", "DONT_EXPIRE_PASSWD"]'
          />
        </FormField>
      </div>
    </div>
  );
}
