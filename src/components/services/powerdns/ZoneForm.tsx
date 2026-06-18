"use client";

import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  CREATE_POWERDNS_ZONE_MUTATION,
  UPDATE_POWERDNS_ZONE_MUTATION,
} from "@/lib/graphql/powerdns";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

interface ZoneFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function ZoneForm({ onSubmit, onCancel, initialData }: ZoneFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "NATIVE",
    ttl: initialData?.ttl ? String(initialData.ttl) : "86400",
    soa: initialData?.soa || "",
    master: initialData?.master || "",
    nsec3param: initialData?.nsec3param || "",
    nsec3narrow:
      initialData?.nsec3narrow !== undefined
        ? initialData.nsec3narrow
          ? "true"
          : "false"
        : "false",
    presigned:
      initialData?.presigned !== undefined
        ? initialData.presigned
          ? "true"
          : "false"
        : "false",
    kind: initialData?.kind || "NATIVE",
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
          ? UPDATE_POWERDNS_ZONE_MUTATION
          : CREATE_POWERDNS_ZONE_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            name: formData.name,
            type: formData.type,
            ttl: formData.ttl ? parseInt(formData.ttl, 10) : undefined,
            soa: formData.soa,
            master: formData.master,
            nsec3param: formData.nsec3param,
            nsec3narrow: formData.nsec3narrow === "true",
            presigned: formData.presigned === "true",
            kind: formData.kind,
          },
        },
      });

      onSubmit(
        response[initialData ? "updatePowerdnsZone" : "createPowerdnsZone"],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save zone");
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
            label="Zone Name"
            required
            description="Fully qualified domain name (e.g., example.com)"
          >
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="example.com"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="Kind">
              <select
                name="kind"
                value={formData.kind}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="NATIVE">Native</option>
                <option value="MASTER">Master</option>
                <option value="SLAVE">Slave</option>
              </select>
            </FormField>

            <FormField label="Type">
              <Input
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="NATIVE"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="TTL (seconds)">
              <Input
                name="ttl"
                type="number"
                value={formData.ttl}
                onChange={handleChange}
                placeholder="86400"
              />
            </FormField>

            <FormField label="SOA Record">
              <Input
                name="soa"
                value={formData.soa}
                onChange={handleChange}
                placeholder="ns1.example.com admin.example.com 2024010101 3600 900 604800 86400"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="Master (for Slave zones)">
              <Input
                name="master"
                value={formData.master}
                onChange={handleChange}
                placeholder="192.168.1.10"
              />
            </FormField>

            <FormField label="NSEC3 Parameter">
              <Input
                name="nsec3param"
                value={formData.nsec3param}
                onChange={handleChange}
                placeholder=""
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="NSEC3 Narrow">
              <select
                name="nsec3narrow"
                value={formData.nsec3narrow}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </FormField>

            <FormField label="Presigned">
              <select
                name="presigned"
                value={formData.presigned}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </FormField>
          </div>

          <div className="action-buttons mt-6">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Zone"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
