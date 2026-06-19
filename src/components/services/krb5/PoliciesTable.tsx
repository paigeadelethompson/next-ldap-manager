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
  { header: "Name", key: "name" },
  { header: "Min Length", key: "min_length" },
  { header: "Min Classes", key: "min_classes" },
];

interface Policy {
  name: string;
  min_length?: number;
  min_classes?: number;
}

interface PoliciesTableProps {
  policies: Policy[];
  loading: boolean;
  error: string | null;
}

export function PoliciesTable({ policies, loading, error }: PoliciesTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading policies..." />
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
          <p className="text-gray-500">No policies found.</p>
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
            <TableRow key={policy.name}>
              {COLUMNS.map((col) => {
                const value = (policy as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${policy.name}-${col.key}`}>
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
