"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

interface Entry {
  dn: string;
  attributes: Record<string, unknown>;
}

export default function EditEntryPage({
  params,
}: {
  params: Promise<{ service: string; dn: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function fetchEntry() {
      try {
        // In a real implementation, this would make a GraphQL query
        setEntry({
          dn: resolvedParams.dn,
          attributes: {
            cn: decodeURIComponent(
              resolvedParams.dn.split(",")[0].replace("cn=", ""),
            ),
            objectClass: ["top", "person"],
          },
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load entry");
        setLoading(false);
      }
    }

    fetchEntry();
  }, [resolvedParams.dn, resolvedParams.service]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would submit to GraphQL
      await new Promise((resolve) => setTimeout(resolve, 100));

      router.push(`/${resolvedParams.service}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update entry");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      // In a real implementation, this would submit a GraphQL mutation
      await new Promise((resolve) => setTimeout(resolve, 100));

      router.push(`/${resolvedParams.service}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete entry");
    }
  }

  if (loading) {
    return null;
  }

  if (!entry) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-600 mt-1">{error || "Entry not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Permanently
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete this entry? This action cannot be
          undone.
        </p>
      </Modal>

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {resolvedParams.service}
          </h1>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => router.push(`/${resolvedParams.service}`)}
            >
              Back to List
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Delete Entry
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card title="Edit Entry">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Distinguished Name"
              description="Cannot be changed"
            >
              <Input value={entry.dn} readOnly className="bg-gray-100" />
            </FormField>

            <FormField label="Common Name" required>
              <Input
                name="cn"
                defaultValue={(entry.attributes.cn as string) || ""}
                required
              />
            </FormField>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => router.push(`/${resolvedParams.service}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Raw Attributes
          </h3>
          <div className="font-mono text-xs bg-gray-50 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(entry.attributes, null, 2)}
          </div>
        </Card>
      </main>
    </div>
  );
}
