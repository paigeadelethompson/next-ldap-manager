"use client";

import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  CREATE_OPENDKIM_SELECTOR_MUTATION,
  UPDATE_OPENDKIM_SELECTOR_MUTATION,
} from "@/lib/graphql/opendkim";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";

interface SelectorFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function SelectorForm({
  onSubmit,
  onCancel,
  initialData,
}: SelectorFormProps) {
  const [formData, setFormData] = useState({
    selectorName: initialData?.selectorName || "",
    domain: initialData?.domain || "",
    keyFile:
      initialData?.keyFile || "/etc/opendkim/keys/domain.com/default.private",
    key: initialData?.key || "",
    canonicHeaders: initialData?.canonicHeaders || "relaxed",
    canonicBody: initialData?.canonicBody || "relaxed",
    signAlgorithm: initialData?.signAlgorithm || "rsa-sha256",
    subDomains:
      initialData?.subDomains !== undefined
        ? initialData.subDomains
          ? "true"
          : "false"
        : "false",
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
        query: initialData
          ? UPDATE_OPENDKIM_SELECTOR_MUTATION
          : CREATE_OPENDKIM_SELECTOR_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            selectorName: formData.selectorName,
            domain: formData.domain,
            keyFile: formData.keyFile,
            key: formData.key,
            canonicHeaders: formData.canonicHeaders,
            canonicBody: formData.canonicBody,
            signAlgorithm: formData.signAlgorithm,
            subDomains: formData.subDomains === "true",
          },
        },
      });

      onSubmit(
        response[
          initialData ? "updateOpenDkimSelector" : "createOpenDkimSelector"
        ],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save selector");
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
        <div className="grid grid-cols-2 gap-6">
          <FormField label="Selector Name" required>
            <Input
              name="selectorName"
              value={formData.selectorName}
              onChange={handleChange}
              placeholder="default"
              required
            />
          </FormField>

          <FormField label="Domain" required>
            <Input
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              placeholder="example.com"
              required
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Key File Path">
            <Input
              name="keyFile"
              value={formData.keyFile}
              onChange={handleChange}
              placeholder="/etc/opendkim/keys/domain.com/default.private"
            />
          </FormField>

          <FormField label="Public Key (optional)">
            <Input
              name="key"
              type="password"
              value={formData.key}
              onChange={handleChange}
              placeholder="Enter public key if not using file"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Canonicalization (Headers)">
            <select
              name="canonicHeaders"
              value={formData.canonicHeaders}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="simple">Simple</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </FormField>

          <FormField label="Canonicalization (Body)">
            <select
              name="canonicBody"
              value={formData.canonicBody}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="simple">Simple</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Signing Algorithm">
            <select
              name="signAlgorithm"
              value={formData.signAlgorithm}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="rsa-sha256">RSA-SHA256</option>
              <option value="rsa-sha1">RSA-SHA1</option>
            </select>
          </FormField>

          <FormField label="Sign Sub-Domains">
            <select
              name="subDomains"
              value={formData.subDomains}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </FormField>
        </div>
      </div>
    </div>
  );
}
