"use client";

import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql/client";
import { CREATE_GROUP_MUTATION } from "@/lib/graphql/openldap";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

interface GroupFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function GroupForm({ onSubmit, onCancel, initialData }: GroupFormProps) {
  const [formData, setFormData] = useState({
    cn: initialData?.cn || "",
    gidNumber: initialData?.gidNumber ? String(initialData.gidNumber) : "",
    memberUid: (initialData?.memberUid as string[])?.join(",") || "",
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

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const response = await graphqlRequest({
        query: CREATE_GROUP_MUTATION,
        variables: {
          input: formData,
        },
      });

      onSubmit(response.createOpenLdapGroup);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group");
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
            label="Group Name (cn)"
            required
            description="Name of the group"
          >
            <Input
              name="cn"
              value={formData.cn}
              onChange={handleChange}
              placeholder="developers"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              label="GID Number"
              description="Group ID (auto-assigned if empty)"
            >
              <Input
                name="gidNumber"
                value={formData.gidNumber}
                onChange={handleChange}
                type="number"
                placeholder="1000"
              />
            </FormField>
          </div>

          <FormField
            label="Members (comma-separated UIDs)"
            description="User IDs belonging to this group"
          >
            <Input
              name="memberUid"
              value={formData.memberUid}
              onChange={handleChange}
              placeholder="jdoe,asmith,jbrown"
            />
          </FormField>

          <FormField label="Description">
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Development team"
            />
          </FormField>
        </div>

        <div className="action-buttons mt-6">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </form>
    </div>
  );
}
