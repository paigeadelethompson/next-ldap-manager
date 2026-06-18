"use client";

import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  CREATE_NETCRAVE_ICAP_SERVICE_MUTATION,
  UPDATE_NETCRAVE_ICAP_SERVICE_MUTATION,
} from "@/lib/graphql/netcrave";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

interface IcapServiceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function IcapServiceForm({
  onSubmit,
  onCancel,
  initialData,
}: IcapServiceFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    hostname: initialData?.hostname || "",
    port: initialData?.port ? String(initialData.port) : "1344",
    uri: initialData?.uri || "/",
    version: initialData?.version || "1.0",
    enabled:
      initialData?.enabled !== undefined
        ? initialData.enabled
          ? "true"
          : "false"
        : "true",
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
          ? UPDATE_NETCRAVE_ICAP_SERVICE_MUTATION
          : CREATE_NETCRAVE_ICAP_SERVICE_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            name: formData.name,
            hostname: formData.hostname,
            port: parseInt(formData.port, 10),
            uri: formData.uri,
            version: formData.version,
            enabled: formData.enabled === "true",
          },
        },
      });

      onSubmit(
        response[
          initialData
            ? "updateNetcraveIcapService"
            : "createNetcraveIcapService"
        ],
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save ICAP service",
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
          <FormField
            label="Service Name"
            required
            description="Name of the ICAP service"
          >
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="av-scanner"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="Hostname" required>
              <Input
                name="hostname"
                value={formData.hostname}
                onChange={handleChange}
                placeholder="icap-server.local"
                required
              />
            </FormField>

            <FormField label="Port" required>
              <Input
                name="port"
                type="number"
                value={formData.port}
                onChange={handleChange}
                placeholder="1344"
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="URI Path">
              <Input
                name="uri"
                value={formData.uri}
                onChange={handleChange}
                placeholder="/"
              />
            </FormField>

            <FormField label="Version">
              <select
                name="version"
                value={formData.version}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="1.0">1.0</option>
                <option value="0.9">0.9</option>
              </select>
            </FormField>
          </div>

          <FormField label="Enabled">
            <select
              name="enabled"
              value={formData.enabled}
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
            {loading ? "Creating..." : "Create ICAP Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}
