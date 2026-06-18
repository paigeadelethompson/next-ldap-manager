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

  // Import forms dynamically based on entry type
  let FormComponent: React.FC<{
    onSubmit: (data: any) => void;
    onCancel: () => void;
  }>;
  let service = resolvedParams.service;

  switch (entryType) {
    // OpenLDAP
    case "user":
      FormComponent = UserForm;
      break;
    case "group":
      FormComponent = GroupForm;
      break;
    case "ou":
      FormComponent = OuForm;
      break;

    // PowerDNS
    case "zone":
      FormComponent = ZoneForm;
      break;
    case "record":
      FormComponent = RecordForm;
      break;

    // FreeRADIUS
    case "profile":
      FormComponent = ProfileForm;
      break;
    case "nas":
      FormComponent = NASForm;
      break;
    case "attribute":
      FormComponent = AttributeForm;
      break;

    // Asterisk
    case "extension":
      FormComponent = DialplanForm;
      break;
    case "trunk":
      FormComponent = SipAccountForm;
      break;
    case "voicemail":
      FormComponent = VoicemailForm;
      break;
    case "sipAccount":
      FormComponent = SipAccountForm;
      break;
    case "iaxAccount":
      FormComponent = IaxAccountForm;
      break;

    // Kerberos
    case "principal":
      FormComponent = PrincipalForm;
      break;
    case "realm":
      FormComponent = RealmForm;
      break;
    case "policy":
      FormComponent = PolicyForm;
      break;

    // Netcrave
    case "template":
      FormComponent = TemplateForm;
      break;
    case "certificate":
      FormComponent = CertificateForm;
      break;
    case "icapService":
      FormComponent = IcapServiceForm;
      break;

    // OpenDKIM
    case "domain":
      FormComponent = DomainForm;
      break;
    case "key":
      FormComponent = SelectorForm;
      break;
    case "signingPolicy":
      FormComponent = SigningPolicyForm;
      break;

    // Sendmail
    case "alias":
      FormComponent = AliasForm;
      break;
    case "map":
      FormComponent = MapForm;
      break;
    case "class":
      FormComponent = ClassForm;
      break;

    default:
      FormComponent = UserForm;
  }

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

  const handleFormSubmit = async (data: any) => {
    // Form component handles its own graphql request, this is just post-submit
    handleSubmit(data);
  };

  const onCancel = () => {
    router.push(`/${resolvedParams.service}`);
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
        <FormComponent onSubmit={handleFormSubmit} onCancel={onCancel} />
      </Card>
    </div>
  );
}
