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
  { header: "Active", key: "active" },
];

interface Domain {
  domain: string;
  selector?: string;
  active?: number;
}

interface DomainsTableProps {
  domains: Domain[];
  loading: boolean;
  error: string | null;
}

export function DomainsTable({ domains, loading, error }: DomainsTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading domains..." />
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

  if (domains.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No domains found.</p>
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
          {domains.map((d) => (
            <TableRow key={d.domain}>
              {COLUMNS.map((col) => {
                const value = (d as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${d.domain}-${col.key}`}>
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
