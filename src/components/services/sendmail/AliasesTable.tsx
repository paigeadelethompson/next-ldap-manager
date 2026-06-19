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
  { header: "Local", key: "local" },
  { header: "Target", key: "target" },
];

interface Alias {
  local: string;
  target?: string;
}

interface AliasesTableProps {
  aliases: Alias[];
  loading: boolean;
  error: string | null;
}

export function AliasesTable({ aliases, loading, error }: AliasesTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading aliases..." />
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

  if (aliases.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No aliases found.</p>
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
          {aliases.map((alias) => (
            <TableRow key={alias.local}>
              {COLUMNS.map((col) => {
                const value = (alias as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${alias.local}-${col.key}`}>
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
