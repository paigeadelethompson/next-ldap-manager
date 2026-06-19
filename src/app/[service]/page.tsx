"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { getServiceConfig } from "@/lib/services";
import { graphqlRequest } from "@/lib/graphql/client";
import { UsersTable } from "@/components/services/openldap/UsersTable";
import { GroupsTable } from "@/components/services/openldap/GroupsTable";
import { OusTable } from "@/components/services/openldap/OusTable";
import { ZonesTable } from "@/components/services/powerdns/ZonesTable";
import { RecordsTable } from "@/components/services/powerdns/RecordsTable";
import { ProfilesTable } from "@/components/services/freeradius/ProfilesTable";
import { NASsTable } from "@/components/services/freeradius/NASsTable";
import { AttributesTable } from "@/components/services/freeradius/AttributesTable";
import { ExtensionsTable } from "@/components/services/asterisk/ExtensionsTable";
import { TrunksTable } from "@/components/services/asterisk/TrunksTable";
import { VoicemailsTable } from "@/components/services/asterisk/VoicemailsTable";
import { SipAccountsTable } from "@/components/services/asterisk/SipAccountsTable";
import { IaxAccountsTable } from "@/components/services/asterisk/IaxAccountsTable";
import { PrincipalsTable } from "@/components/services/krb5/PrincipalsTable";
import { RealmsTable } from "@/components/services/krb5/RealmsTable";
import { PoliciesTable } from "@/components/services/krb5/PoliciesTable";
import { TemplatesTable } from "@/components/services/netcrave/TemplatesTable";
import { CertificatesTable } from "@/components/services/netcrave/CertificatesTable";
import { IcapServicesTable } from "@/components/services/netcrave/IcapServicesTable";
import { DomainsTable } from "@/components/services/opendkim/DomainsTable";
import { SelectorsTable } from "@/components/services/opendkim/SelectorsTable";
import { SigningPoliciesTable } from "@/components/services/opendkim/SigningPoliciesTable";
import { AliasesTable } from "@/components/services/sendmail/AliasesTable";
import { MapsTable } from "@/components/services/sendmail/MapsTable";
import { ClassesTable } from "@/components/services/sendmail/ClassesTable";

type EntryType =
  | "user"
  | "group"
  | "ou"
  | "record"
  | "zone"
  | "extension"
  | "trunk"
  | "voicemail"
  | "sipAccount"
  | "iaxAccount"
  | "principal"
  | "realm"
  | "policy"
  | "profile"
  | "nas"
  | "attribute"
  | "template"
  | "certificate"
  | "icapService"
  | "domain"
  | "key"
  | "signingPolicy"
  | "alias"
  | "map"
  | "class";

interface ServiceEntry {
  dn: string;
  [key: string]: unknown;
}

// GraphQL query for fetching entries
const FETCH_ENTRIES_QUERY = `
  query($baseDN: String!, $filter: String) {
    ldapEntries(baseDN: $baseDN, filter: $filter, scope: "subtree", attributes: ["*"]) {
      dn
      attributes
    }
  }
`;

export default function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const serviceConfig = getServiceConfig(resolvedParams.service);

  const [entries, setEntries] = useState<ServiceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true);
      setError(null);

      try {
        const baseDN = process.env.LDAP_BASE_DN || "dc=netcrave,dc=local";

        // Determine filter based on service
        let filter = "(objectClass=*)";
        if (resolvedParams.service === "openldap") {
          filter = "(objectClass=posixAccount)";
        }

        const result = await graphqlRequest<{
          openLdapUsers?: ServiceEntry[];
          ldapEntries?: Array<{
            dn: string;
            attributes: Record<string, unknown>;
          }>;
        }>({
          query:
            resolvedParams.service === "openldap"
              ? `
            query($baseDN: String, $filter: String) {
              openLdapUsers(baseDN: $baseDN, filter: $filter) {
                dn
                cn
                uid
                mail
                givenName
                sn
                telephoneNumber
                title
                ou
              }
            }
          `
              : `
            query($baseDN: String!, $filter: String) {
              ldapEntries(baseDN: $baseDN, filter: $filter, scope: "subtree", attributes: ["*"]) {
                dn
                attributes
              }
            }
          `,
          variables:
            resolvedParams.service === "openldap"
              ? {
                  baseDN: process.env.LDAP_BASE_DN || "dc=netcrave,dc=local",
                  filter: "(objectClass=posixAccount)",
                }
              : { baseDN: process.env.LDAP_BASE_DN || "dc=netcrave,dc=local" },
        });

        // Transform openLdapUsers to ServiceEntry format
        if (resolvedParams.service === "openldap" && result?.openLdapUsers) {
          setEntries(result.openLdapUsers);
        } else if (result?.ldapEntries) {
          const transformed = result.ldapEntries.map((entry) => ({
            dn: entry.dn,
            ...entry.attributes,
          })) as ServiceEntry[];
          setEntries(transformed);
        }
      } catch (err) {
        console.error("Error fetching entries:", err);
        setError(err instanceof Error ? err.message : "Failed to load entries");
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [resolvedParams.service]);

  const renderEntriesTable = (
    entries: ServiceEntry[],
    columns: { header: string; key: string }[],
  ) => {
    if (entries.length === 0) {
      return (
        <div className="py-16 text-center">
          <p className="text-gray-500">No entries found.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, idx) => (
            <TableRow key={entry.dn}>
              <TableCell className="font-medium">{entry.dn}</TableCell>
              {columns.slice(1).map((col) => {
                const value = (entry.attributes as Record<string, unknown>)[
                  col.key
                ];
                return (
                  <TableCell key={`${entry.dn}-${col.key}`}>
                    {Array.isArray(value)
                      ? value.join(", ")
                      : typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value ?? "")}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const getTableColumns = (type: EntryType) => {
    switch (type) {
      case "user":
        return [
          { header: "DN", key: "dn" },
          { header: "Common Name", key: "cn" },
          { header: "UID", key: "uid" },
          { header: "Email", key: "mail" },
        ];
      case "group":
        return [
          { header: "DN", key: "dn" },
          { header: "Name", key: "cn" },
          { header: "GID", key: "gidNumber" },
          { header: "Members", key: "memberUid" },
        ];
      case "ou":
        return [
          { header: "DN", key: "dn" },
          { header: "OU Name", key: "ou" },
          { header: "Description", key: "description" },
        ];
      default:
        return [
          { header: "DN", key: "dn" },
          { header: "Name", key: "name" },
          { header: "Value", key: "value" },
        ];
    }
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {serviceConfig.label}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage {serviceConfig.label} entries
          </p>
        </div>
        <div className="flex gap-3">
          {serviceConfig.entryTypes.map((type) => (
            <Button
              key={type}
              variant="secondary"
              onClick={() =>
                router.push(`/${resolvedParams.service}/new?entryType=${type}`)
              }
            >
              + Create {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </header>

      {/* Entries Table */}
      {resolvedParams.service === "openldap" &&
      serviceConfig.entryTypes.includes("user") ? (
        <UsersTable users={entries} loading={loading} error={error} />
      ) : resolvedParams.service === "openldap" &&
        serviceConfig.entryTypes.includes("group") ? (
        <GroupsTable groups={entries as any} loading={loading} error={error} />
      ) : resolvedParams.service === "openldap" &&
        serviceConfig.entryTypes.includes("ou") ? (
        <OusTable ous={entries as any} loading={loading} error={error} />
      ) : resolvedParams.service === "powerdns" &&
        serviceConfig.entryTypes.includes("zone") ? (
        <ZonesTable zones={entries as any} loading={loading} error={error} />
      ) : resolvedParams.service === "powerdns" &&
        serviceConfig.entryTypes.includes("record") ? (
        <RecordsTable
          records={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "freeradius" &&
        serviceConfig.entryTypes.includes("profile") ? (
        <ProfilesTable
          profiles={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "freeradius" &&
        serviceConfig.entryTypes.includes("nas") ? (
        <NASsTable nass={entries as any} loading={loading} error={error} />
      ) : resolvedParams.service === "freeradius" &&
        serviceConfig.entryTypes.includes("attribute") ? (
        <AttributesTable
          attributes={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "asterisk" &&
        serviceConfig.entryTypes.includes("extension") ? (
        <ExtensionsTable
          extensions={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "asterisk" &&
        serviceConfig.entryTypes.includes("trunk") ? (
        <TrunksTable trunks={entries as any} loading={loading} error={error} />
      ) : resolvedParams.service === "asterisk" &&
        serviceConfig.entryTypes.includes("voicemail") ? (
        <VoicemailsTable
          voicemails={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "asterisk" &&
        serviceConfig.entryTypes.includes("sipAccount") ? (
        <SipAccountsTable
          sipAccounts={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "asterisk" &&
        serviceConfig.entryTypes.includes("iaxAccount") ? (
        <IaxAccountsTable
          iaxAccounts={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "kerberos" &&
        serviceConfig.entryTypes.includes("principal") ? (
        <PrincipalsTable
          principals={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "kerberos" &&
        serviceConfig.entryTypes.includes("realm") ? (
        <RealmsTable realms={entries as any} loading={loading} error={error} />
      ) : resolvedParams.service === "kerberos" &&
        serviceConfig.entryTypes.includes("policy") ? (
        <PoliciesTable
          policies={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "netcrave" &&
        serviceConfig.entryTypes.includes("template") ? (
        <TemplatesTable
          templates={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "netcrave" &&
        serviceConfig.entryTypes.includes("certificate") ? (
        <CertificatesTable
          certificates={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "netcrave" &&
        serviceConfig.entryTypes.includes("icapService") ? (
        <IcapServicesTable
          icapServices={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "opendkim" &&
        serviceConfig.entryTypes.includes("domain") ? (
        <DomainsTable
          domains={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "opendkim" &&
        serviceConfig.entryTypes.includes("key") ? (
        <SelectorsTable
          selectors={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "opendkim" &&
        serviceConfig.entryTypes.includes("signingPolicy") ? (
        <SigningPoliciesTable
          policies={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "sendmail" &&
        serviceConfig.entryTypes.includes("alias") ? (
        <AliasesTable
          aliases={entries as any}
          loading={loading}
          error={error}
        />
      ) : resolvedParams.service === "sendmail" &&
        serviceConfig.entryTypes.includes("map") ? (
        <MapsTable maps={entries as any} loading={loading} error={error} />
      ) : resolvedParams.service === "sendmail" &&
        serviceConfig.entryTypes.includes("class") ? (
        <ClassesTable
          classes={entries as any}
          loading={loading}
          error={error}
        />
      ) : (
        <Card>
          {loading ? (
            <Loading fullScreen text="Loading entries..." />
          ) : error ? (
            <div className="card-content">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            renderEntriesTable(
              entries,
              getTableColumns(serviceConfig.entryTypes[0]),
            )
          )}
        </Card>
      )}
    </div>
  );
}
