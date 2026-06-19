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
  { header: "Extension", key: "extension" },
  { header: "Context", key: "context" },
  { header: "Priority", key: "priority" },
  { header: "Application", key: "application" },
];

interface Extension {
  extension: string;
  context?: string;
  priority?: number;
  application?: string;
}

interface ExtensionsTableProps {
  extensions: Extension[];
  loading: boolean;
  error: string | null;
}

export function ExtensionsTable({
  extensions,
  loading,
  error,
}: ExtensionsTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading extensions..." />
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

  if (extensions.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No extensions found.</p>
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
          {extensions.map((ext) => (
            <TableRow key={`${ext.context}-${ext.extension}`}>
              {COLUMNS.map((col) => {
                const value = (ext as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${ext.context}-${ext.extension}-${col.key}`}>
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
