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
  { header: "Principal", key: "principal" },
  { header: "Realm", key: "realm" },
  { header: "Last Password Change", key: "last_password_change" },
];

interface Principal {
  principal: string;
  realm?: string;
  last_password_change?: string;
}

interface PrincipalsTableProps {
  principals: Principal[];
  loading: boolean;
  error: string | null;
}

export function PrincipalsTable({ principals, loading, error }: PrincipalsTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading principals..." />
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

  if (principals.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No principals found.</p>
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
          {principals.map((p) => (
            <TableRow key={p.principal}>
              {COLUMNS.map((col) => {
                const value = (p as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${p.principal}-${col.key}`}>
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
