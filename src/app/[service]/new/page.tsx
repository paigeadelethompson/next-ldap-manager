"use client";

import { useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
// OpenLDAP forms
import { UserForm } from "@/components/services/openldap/UserForm";
import { GroupForm } from "@/components/services/openldap/GroupForm";
import { OuForm } from "@/components/services/openldap/OuForm";
// PowerDNS forms
import { ZoneForm } from "@/components/services/powerdns/ZoneForm";
import { RecordForm } from "@/components/services/powerdns/RecordForm";
// FreeRADIUS forms
import { ProfileForm } from "@/components/services/freeradius/ProfileForm";
import { NASForm } from "@/components/services/freeradius/NASForm";
import { AttributeForm } from "@/components/services/freeradius/AttributeForm";
// Asterisk forms
import { VoicemailForm } from "@/components/services/asterisk/VoicemailForm";
import { DialplanForm } from "@/components/services/asterisk/DialplanForm";
import { IaxAccountForm } from "@/components/services/asterisk/IaxAccountForm";
import { SipAccountForm } from "@/components/services/asterisk/SipAccountForm";
// Kerberos forms
import { PolicyForm } from "@/components/services/krb5/PolicyForm";
import { RealmForm } from "@/components/services/krb5/RealmForm";
import { PrincipalForm } from "@/components/services/krb5/PrincipalForm";
// Netcrave forms
import { TemplateForm } from "@/components/services/netcrave/TemplateForm";
import { CertificateForm } from "@/components/services/netcrave/CertificateForm";
import { IcapServiceForm } from "@/components/services/netcrave/IcapServiceForm";
// OpenDKIM forms
import { DomainForm } from "@/components/services/opendkim/DomainForm";
import { SelectorForm } from "@/components/services/opendkim/SelectorForm";
import { SigningPolicyForm } from "@/components/services/opendkim/SigningPolicyForm";
// Sendmail forms
import { ClassForm } from "@/components/services/sendmail/ClassForm";
import { MapForm } from "@/components/services/sendmail/MapForm";
import { AliasForm } from "@/components/services/sendmail/AliasForm";
import { Card } from "@/components/ui/Card";
import { getServiceConfig } from "@/lib/services";

type EntryType =
  | "user"
  | "group"
  | "ou"
  | "zone"
  | "record"
  | "extension"
  | "trunk"
  | "principal"
  | "realm"
  | "domain"
  | "key"
  | "alias"
  | "profile"
  | "nas"
  | "attribute"
  | "voicemail"
  | "sipAccount"
  | "iaxAccount"
  | "template"
  | "certificate"
  | "icapService"
  | "signingPolicy";

export default function NewEntryPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const entryType = (searchParams.get("entryType") as EntryType) || "user";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdEntry, setCreatedEntry] = useState<any>(null);

  async function handleSubmit(data: any) {
    setCreatedEntry(data);
    setError(null);
    setLoading(true);

    try {
      router.push(`/${resolvedParams.service}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create entry");
    } finally {
      setLoading(false);
    }
  }

  const renderForm = () => {
    const service = resolvedParams.service;

    switch (entryType) {
      // OpenLDAP
      case "user":
        return (
          <UserForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "group":
        return (
          <GroupForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "ou":
        return (
          <OuForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );

      // PowerDNS
      case "zone":
        return (
          <ZoneForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "record":
        return (
          <RecordForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );

      // FreeRADIUS (profiles are used as users, NAS for clients)
      case "profile":
        return (
          <ProfileForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "nas":
        return (
          <NASForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "attribute":
        return (
          <AttributeForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );

      // Asterisk
      case "extension":
        return (
          <DialplanForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "trunk":
        return (
          <SipAccountForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "voicemail":
        return (
          <VoicemailForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "sipAccount":
        return (
          <SipAccountForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "iaxAccount":
        return (
          <IaxAccountForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );

      // Kerberos
      case "principal":
        return (
          <PrincipalForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "realm":
        return (
          <RealmForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "policy":
        return (
          <PolicyForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );

      // Netcrave
      case "template":
        return (
          <TemplateForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "certificate":
        return (
          <CertificateForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "icapService":
        return (
          <IcapServiceForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );

      // OpenDKIM
      case "domain":
        return (
          <DomainForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "key":
        return (
          <SelectorForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "signingPolicy":
        return (
          <SigningPolicyForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );

      // Sendmail
      case "alias":
        return (
          <AliasForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "map":
        return (
          <MapForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
      case "class":
        return (
          <ClassForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${resolvedParams.service}`)}
          />
        );
    }
  };

  const serviceConfig = getServiceConfig(resolvedParams.service);

  if (createdEntry) {
    return (
      <div className="page-wrapper">
        <Card
          title={`Successfully Created ${entryType.charAt(0).toUpperCase() + entryType.slice(1)}`}
        >
          <div className="card-content">
            <p className="text-green-600 mb-4">
              The {entryType} was created successfully!
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>DN:</strong> {createdEntry.dn}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Form Card */}
      <Card
        title={`Create New ${entryType.charAt(0).toUpperCase() + entryType.slice(1)}`}
      >
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}
        <div className="card-content">{renderForm()}</div>
        <div className="action-buttons">
          <Button
            variant="secondary"
            onClick={() => router.push(`/${resolvedParams.service}`)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              setError("Please fill out the form and submit it");
              setTimeout(() => setLoading(false), 1000);
            }}
          >
            {loading
              ? "Creating..."
              : `Create ${entryType.charAt(0).toUpperCase() + entryType.slice(1)}`}
          </Button>
        </div>
      </Card>
    </div>
  );
}
