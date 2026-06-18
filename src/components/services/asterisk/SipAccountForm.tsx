"use client";

import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  CREATE_ASTERISK_SIP_ACCOUNT_MUTATION,
  UPDATE_ASTERISK_SIP_ACCOUNT_MUTATION,
} from "@/lib/graphql/asterisk";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";

interface SipAccountFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function SipAccountForm({
  onSubmit,
  onCancel,
  initialData,
}: SipAccountFormProps) {
  const [formData, setFormData] = useState({
    accountid: initialData?.accountid || "",
    secret: initialData?.secret || "",
    context: initialData?.context || "default",
    host: initialData?.host || "",
    nat: initialData?.nat || "yes",
    type: initialData?.type || "friend",
    allow: initialData?.allow || "g729,g711",
    disallow: initialData?.disallow || "all",
    dtmfmode: initialData?.dtmfmode || "rfc2833",
    canreinvite: initialData?.canreinvite || "no",
    callgroup: initialData?.callgroup || "",
    pickupgroup: initialData?.pickupgroup || "",
    mailbox: initialData?.mailbox || "",
    callerid: initialData?.callerid || "",
    trustrdn: initialData?.trustrdn || "yes",
    rmip: initialData?.rmip || "",
    regseconds: initialData?.regseconds ? String(initialData.regseconds) : "",
    ipaddr: initialData?.ipaddr || "",
    cpeflags: initialData?.cpeflags || "",
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
          ? UPDATE_ASTERISK_SIP_ACCOUNT_MUTATION
          : CREATE_ASTERISK_SIP_ACCOUNT_MUTATION,
        variables: {
          dn: initialData?.dn,
          input: {
            accountid: formData.accountid,
            secret: formData.secret,
            context: formData.context,
            host: formData.host,
            nat: formData.nat,
            type: formData.type,
            allow: formData.allow,
            disallow: formData.disallow,
            dtmfmode: formData.dtmfmode,
            canreinvite: formData.canreinvite,
            callgroup: formData.callgroup,
            pickupgroup: formData.pickupgroup,
            mailbox: formData.mailbox,
            callerid: formData.callerid,
            trustrdn: formData.trustrdn,
            rmip: formData.rmip,
            regseconds: formData.regseconds
              ? parseInt(formData.regseconds, 10)
              : undefined,
            ipaddr: formData.ipaddr,
            cpeflags: formData.cpeflags,
          },
        },
      });

      onSubmit(
        response[
          initialData ? "updateAsteriskSipAccount" : "createAsteriskSipAccount"
        ],
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save SIP account",
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
          description="SIP account username/extension"
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

          <FormField label="NAT">
            <select
              name="nat"
              value={formData.nat}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="never">Never</option>
              <option value="route">Route</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Type">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="friend">Friend</option>
              <option value="user">User</option>
              <option value="peer">Peer</option>
            </select>
          </FormField>

          <FormField label="DTMF Mode">
            <select
              name="dtmfmode"
              value={formData.dtmfmode}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="rfc2833">RFC 2833</option>
              <option value="info">INFO</option>
              <option value="inband">In-band</option>
              <option value="auto">Auto</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Allow Codecs">
            <Input
              name="allow"
              value={formData.allow}
              onChange={handleChange}
              placeholder="g729,g711"
            />
          </FormField>

          <FormField label="Disallow Codecs">
            <Input
              name="disallow"
              value={formData.disallow}
              onChange={handleChange}
              placeholder="all"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Can Reinvite">
            <select
              name="canreinvite"
              value={formData.canreinvite}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </FormField>

          <FormField label="Trust RDN">
            <select
              name="trustrdn"
              value={formData.trustrdn}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
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

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Mailbox">
            <Input
              name="mailbox"
              value={formData.mailbox}
              onChange={handleChange}
              placeholder="1000@default"
            />
          </FormField>

          <FormField label="Caller ID">
            <Input
              name="callerid"
              value={formData.callerid}
              onChange={handleChange}
              placeholder='"John Doe" &lt;1000&gt;'
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
