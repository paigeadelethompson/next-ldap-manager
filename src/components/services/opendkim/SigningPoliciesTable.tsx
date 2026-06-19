"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";

const COLUMNS = [
  { header: "Domain", key: "domain" },
  { header: "Selector", key: "selector" },
  { header: "Algorithm", key: "algorithm" },
];

interface SigningPolicy {
  domain: string;
  selector?: string;
  algorithm?: string;
}

interface SigningPoliciesTableProps {
  policies: SigningPolicy[];
  loading: boolean;
  error: string | null;
}

export function SigningPoliciesTable({
  policies,
  loading,
  error,
}: SigningPoliciesTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading signing policies..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="card-content">
          <p className="text-red-600">{error}</p>
        </div>
      </Card>
    );
  }

  if (policies.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No signing policies found.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={`${policy.domain}-${policy.selector}`}>
              {COLUMNS.map((col) => {
                const value = (policy as Record<string, unknown>)[col.key];
                return (
                  <TableCell
                    key={`${policy.domain}-${policy.selector}-${col.key}`}
                  >
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
    </Card>
  );
}
