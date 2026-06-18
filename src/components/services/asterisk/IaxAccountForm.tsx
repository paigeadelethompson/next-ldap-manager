"use client";

import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  CREATE_ASTERISK_IAX_ACCOUNT_MUTATION,
  UPDATE_ASTERISK_IAX_ACCOUNT_MUTATION,
} from "@/lib/graphql/asterisk";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";

interface IaxAccountFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function IaxAccountForm({
  onSubmit,
  onCancel,
  initialData,
}: IaxAccountFormProps) {
  const [formData, setFormData] = useState({
    accountid: initialData?.accountid || "",
    secret: initialData?.secret || "",
    context: initialData?.context || "default",
    host: initialData?.host || "",
    trunks: initialData?.trunks ? "true" : "false",
    transfer: initialData?.transfer || "",
    password: initialData?.password || "",
    callgroup: initialData?.callgroup || "",
    pickupgroup: initialData?.pickupgroup || "",
    mailboxes: initialData?.mailboxes || "",
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
          ? UPDATE_ASTERISK_IAX_ACCOUNT_MUTATION
          : CREATE_ASTERISK_IAX_ACCOUNT_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            accountid: formData.accountid,
            secret: formData.secret,
            context: formData.context,
            host: formData.host,
            trunks: formData.trunks === "true",
            transfer: formData.transfer,
            password: formData.password,
            callgroup: formData.callgroup,
            pickupgroup: formData.pickupgroup,
            mailboxes: formData.mailboxes,
          },
        },
      });

      onSubmit(
        response[
          initialData ? "updateAsteriskIaxAccount" : "createAsteriskIaxAccount"
        ],
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save IAX account",
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

      <div className="space-y-6">
        <FormField
          label="Account ID"
          required
          description="IAX account username/extension"
        >
          <Input
            name="accountid"
            value={formData.accountid}
            onChange={handleChange}
            placeholder="1000"
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Secret (Password)" required>
            <Input
              name="secret"
              type="password"
              value={formData.secret}
              onChange={handleChange}
              placeholder="secure-password"
              required
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
          <FormField label="Host">
            <Input
              name="host"
              value={formData.host}
              onChange={handleChange}
              placeholder="dynamic"
            />
          </FormField>

          <FormField label="Trunks">
            <select
              name="trunks"
              value={formData.trunks}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Transfer">
            <Input
              name="transfer"
              value={formData.transfer}
              onChange={handleChange}
              placeholder="yes"
            />
          </FormField>

          <FormField label="Password">
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="password"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Call Group">
            <Input
              name="callgroup"
              value={formData.callgroup}
              onChange={handleChange}
              placeholder="1,2,3"
            />
          </FormField>

          <FormField label="Pickup Group">
            <Input
              name="pickupgroup"
              value={formData.pickupgroup}
              onChange={handleChange}
              placeholder="1,2,3"
            />
          </FormField>
        </div>

        <FormField label="Mailboxes">
          <Input
            name="mailboxes"
            value={formData.mailboxes}
            onChange={handleChange}
            placeholder="1000@default,1001@default"
          />
        </FormField>
      </div>
    </div>
  );
}
