"use client";

import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  CREATE_ASTERISK_VOICEMAIL_MUTATION,
  UPDATE_ASTERISK_VOICEMAIL_MUTATION,
} from "@/lib/graphql/asterisk";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

interface VoicemailFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function VoicemailForm({
  onSubmit,
  onCancel,
  initialData,
}: VoicemailFormProps) {
  const [formData, setFormData] = useState({
    uniqueid: initialData?.uniqueid || "",
    password: initialData?.password || "",
    fullname: initialData?.fullname || "",
    email: initialData?.email || "",
    pager: initialData?.pager || "",
    attach: initialData?.attach || "yes",
    tz: initialData?.tz || "",
    dialout: initialData?.dialout || "",
    context: initialData?.context || "default",
    exten: initialData?.exten || "",
    emergency_context: initialData?.emergency_context || "",
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
          ? UPDATE_ASTERISK_VOICEMAIL_MUTATION
          : CREATE_ASTERISK_VOICEMAIL_MUTATION,
        variables: {
          uniqueid: initialData?.uniqueid,
          input: {
            uniqueid: formData.uniqueid,
            password: formData.password,
            fullname: formData.fullname,
            email: formData.email,
            pager: formData.pager,
            attach: formData.attach,
            tz: formData.tz,
            dialout: formData.dialout,
            context: formData.context,
            exten: formData.exten,
            emergency_context: formData.emergency_context,
          },
        },
      });

      onSubmit(
        response[
          initialData ? "updateAsteriskVoicemail" : "createAsteriskVoicemail"
        ],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save voicemail");
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
            label="Unique ID (User)"
            required
            description="Voicemail box number/user"
          >
            <Input
              name="uniqueid"
              value={formData.uniqueid}
              onChange={handleChange}
              placeholder="1000"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="Password" required>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="1234"
                required
              />
            </FormField>

            <FormField label="Full Name" required>
              <Input
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="Email">
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </FormField>

            <FormField label="Pager">
              <Input
                name="pager"
                type="email"
                value={formData.pager}
                onChange={handleChange}
                placeholder="pager@example.com"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="Attach Voicemail">
              <select
                name="attach"
                value={formData.attach}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </FormField>

            <FormField label="Time Zone">
              <Input
                name="tz"
                value={formData.tz}
                onChange={handleChange}
                placeholder="america/new_york"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="Dialout">
              <Input
                name="dialout"
                value={formData.dialout}
                onChange={handleChange}
                placeholder="local"
              />
            </FormField>

            <FormField label="Context">
              <Input
                name="context"
                value={formData.context}
                onChange={handleChange}
                placeholder="default"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="Extension">
              <Input
                name="exten"
                value={formData.exten}
                onChange={handleChange}
                placeholder="1000"
              />
            </FormField>

            <FormField label="Emergency Context">
              <Input
                name="emergency_context"
                value={formData.emergency_context}
                onChange={handleChange}
                placeholder="default"
              />
            </FormField>
          </div>
        </div>

        <div className="action-buttons mt-6">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Voicemail"}
          </Button>
        </div>
      </form>
    </div>
  );
}
