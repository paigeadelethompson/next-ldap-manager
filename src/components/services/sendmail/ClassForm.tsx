"use client";

import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  CREATE_SENDMAIL_CLASS_MUTATION,
  UPDATE_SENDMAIL_CLASS_MUTATION,
} from "@/lib/graphql/sendmail";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";

interface ClassFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function ClassForm({ onSubmit, onCancel, initialData }: ClassFormProps) {
  const [formData, setFormData] = useState({
    className: initialData?.className || "",
    members: initialData?.members
      ? JSON.stringify(initialData.members, null, 2)
      : "[]",
    description: initialData?.description || "",
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
      let members = undefined;
      if (formData.members.trim()) {
        try {
          members = JSON.parse(formData.members);
        } catch (err) {
          throw new Error("Invalid JSON in members field");
        }
      }

      const response = await graphqlRequest({
        query: initialData
          ? UPDATE_SENDMAIL_CLASS_MUTATION
          : CREATE_SENDMAIL_CLASS_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            className: formData.className,
            members,
            description: formData.description,
          },
        },
      });

      onSubmit(
        response[initialData ? "updateSendmailClass" : "createSendmailClass"],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save class");
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
          label="Class Name"
          required
          description="Name of the Sendmail class (e.g., local)"
        >
          <Input
            name="className"
            value={formData.className}
            onChange={handleChange}
            placeholder="local"
            required
          />
        </FormField>

        <FormField label="Members (JSON array)" required>
          <textarea
            name="members"
            value={formData.members}
            onChange={handleTextAreaChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 font-mono text-sm"
            rows={6}
            placeholder='["user1@example.com", "user2@example.com"]'
            required
          />
        </FormField>

        <FormField label="Description">
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Local delivery members"
          />
        </FormField>
      </div>
    </div>
  );
}
