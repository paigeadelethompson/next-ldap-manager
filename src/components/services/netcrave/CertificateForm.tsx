"use client";

import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  ISSUE_NETCRAVE_CERTIFICATE_MUTATION,
  REVOKE_NETCRAVE_CERTIFICATE_MUTATION,
  RESTORE_NETCRAVE_CERTIFICATE_MUTATION,
} from "@/lib/graphql/netcrave";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

interface CertificateFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function CertificateForm({
  onSubmit,
  onCancel,
  initialData,
}: CertificateFormProps) {
  const [formData, setFormData] = useState({
    templateDn: initialData?.templateDn || "",
    cn: initialData?.cn || "",
    san: initialData?.san ? JSON.stringify(initialData.san, null, 2) : "",
    validityDays: initialData?.validityDays
      ? String(initialData.validityDays)
      : "365",
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
      let san = undefined;
      if (formData.san.trim()) {
        try {
          san = JSON.parse(formData.san);
        } catch (err) {
          throw new Error("Invalid JSON in SAN field");
        }
      }

      const response = await graphqlRequest({
        query: initialData
          ? REVOKE_NETCRAVE_CERTIFICATE_MUTATION
          : ISSUE_NETCRAVE_CERTIFICATE_MUTATION,
        variables: {
          input: {
            templateDn: formData.templateDn,
            cn: formData.cn,
            san,
            validityDays: formData.validityDays
              ? parseInt(formData.validityDays, 10)
              : undefined,
          },
          dn: initialData?.dn,
          reason: "complianceRevoked",
        },
      });

      onSubmit(
        response[
          initialData ? "revokeNetcraveCertificate" : "issueNetcraveCertificate"
        ],
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process certificate",
      );
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
          {!initialData && (
            <>
              <FormField
                label="Template DN"
                required
                description="Distinguished name of the certificate template"
              >
                <Input
                  name="templateDn"
                  value={formData.templateDn}
                  onChange={handleChange}
                  placeholder="cn=server-cert,ou=templates,dc=example,dc=com"
                  required
                />
              </FormField>

              <FormField label="Common Name (CN)" required>
                <Input
                  name="cn"
                  value={formData.cn}
                  onChange={handleChange}
                  placeholder="example.com"
                  required
                />
              </FormField>
            </>
          )}

          {initialData && (
            <FormField label="Action">
              <select
                name="action"
                onChange={(e) => {
                  if (e.target.value === "restore") {
                    onSubmit({ cn: formData.cn, dn: initialData.dn });
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select action...</option>
                <option value="revoke">Revoke Certificate</option>
                <option value="restore">Restore Certificate</option>
              </select>
            </FormField>
          )}

          {!initialData && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <FormField label="Validity Days">
                  <Input
                    name="validityDays"
                    type="number"
                    value={formData.validityDays}
                    onChange={handleChange}
                    placeholder="365"
                  />
                </FormField>
              </div>

              <FormField label="Subject Alternative Names (JSON)">
                <textarea
                  name="san"
                  value={formData.san}
                  onChange={handleTextAreaChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 font-mono text-sm"
                  rows={4}
                  placeholder='["example.com", "*.example.com"]'
                />
              </FormField>
            </>
          )}
        </div>

        <div className="action-buttons mt-6">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Certificate"}
          </Button>
        </div>
      </form>
    </div>
  );
}
