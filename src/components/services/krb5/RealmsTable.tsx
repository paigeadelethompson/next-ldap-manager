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
  { header: "Realm", key: "realm" },
  { header: "KDC", key: "kdc" },
  { header: "Admin Server", key: "admin_server" },
];

interface Realm {
  realm: string;
  kdc?: string;
  admin_server?: string;
}

interface RealmsTableProps {
  realms: Realm[];
  loading: boolean;
  error: string | null;
}

export function RealmsTable({ realms, loading, error }: RealmsTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading realms..." />
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

  if (realms.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No realms found.</p>
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
          {realms.map((r) => (
            <TableRow key={r.realm}>
              {COLUMNS.map((col) => {
                const value = (r as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${r.realm}-${col.key}`}>
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
