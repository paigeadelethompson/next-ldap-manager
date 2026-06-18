"use client";

import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  CREATE_KRB5_REALM_MUTATION,
  UPDATE_KRB5_REALM_MUTATION,
} from "@/lib/graphql/krb5";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";

interface RealmFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function RealmForm({ onSubmit, onCancel, initialData }: RealmFormProps) {
  const [formData, setFormData] = useState({
    realmName: initialData?.realmName || "",
    masterKeyName: initialData?.masterKeyName || "kadmin/changepw",
    supportedKas: initialData?.supportedKas
      ? JSON.stringify(initialData.supportedKas, null, 2)
      : '["kdc", "kadmin"]',
    maxLife: initialData?.maxLife ? String(initialData.maxLife) : "86400",
    maxRenew: initialData?.maxRenew ? String(initialData.maxRenew) : "604800",
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
      let supportedKas = undefined;
      if (formData.supportedKas.trim()) {
        try {
          supportedKas = JSON.parse(formData.supportedKas);
        } catch (err) {
          throw new Error("Invalid JSON in supported KAs field");
        }
      }

      const response = await graphqlRequest({
        query: initialData
          ? UPDATE_KRB5_REALM_MUTATION
          : CREATE_KRB5_REALM_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            realmName: formData.realmName,
            masterKeyName: formData.masterKeyName,
            supportedKas,
            maxLife: formData.maxLife
              ? parseInt(formData.maxLife, 10)
              : undefined,
            maxRenew: formData.maxRenew
              ? parseInt(formData.maxRenew, 10)
              : undefined,
          },
        },
      });

      onSubmit(response[initialData ? "updateKrb5Realm" : "createKrb5Realm"]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save realm");
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
          label="Realm Name"
          required
          description="Kerberos realm name (e.g., EXAMPLE.COM)"
        >
          <Input
            name="realmName"
            value={formData.realmName}
            onChange={handleChange}
            placeholder="EXAMPLE.COM"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Master Key Name">
            <Input
              name="masterKeyName"
              value={formData.masterKeyName}
              onChange={handleChange}
              placeholder="kadmin/changepw"
            />
          </FormField>

          <FormField label="Max Life (seconds)">
            <Input
              name="maxLife"
              type="number"
              value={formData.maxLife}
              onChange={handleChange}
              placeholder="86400"
            />
          </FormField>
        </div>

        <FormField label="Supported KAs (JSON)">
          <textarea
            name="supportedKas"
            value={formData.supportedKas}
            onChange={handleTextAreaChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 font-mono text-sm"
            rows={3}
            placeholder='["kdc", "kadmin"]'
          />
        </FormField>

        <FormField label="Max Renew (seconds)">
          <Input
            name="maxRenew"
            type="number"
            value={formData.maxRenew}
            onChange={handleChange}
            placeholder="604800"
          />
        </FormField>
      </div>
    </div>
  );
}
