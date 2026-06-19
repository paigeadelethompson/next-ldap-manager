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
  { header: "IP Address", key: "ipaddr" },
  { header: "Type", key: "nas_type" },
  { header: "Secret", key: "secret" },
];

interface NAS {
  name: string;
  ipaddr?: string;
  nas_type?: string;
  secret?: string;
}

interface NASsTableProps {
  nass: NAS[];
  loading: boolean;
  error: string | null;
}

export function NASsTable({ nass, loading, error }: NASsTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading NAS devices..." />
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

  if (nass.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No NAS devices found.</p>
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
          {nass.map((nas) => (
            <TableRow key={nas.name}>
              {COLUMNS.map((col) => {
                const value = (nas as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${nas.name}-${col.key}`}>
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
