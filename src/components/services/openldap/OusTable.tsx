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
  { header: "DN", key: "dn" },
  { header: "OU Name", key: "ou" },
  { header: "Description", key: "description" },
];

interface Ou {
  dn: string;
  ou?: string;
  description?: string;
}

interface OusTableProps {
  ous: Ou[];
  loading: boolean;
  error: string | null;
}

export function OusTable({ ous, loading, error }: OusTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading OUs..." />
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

  if (ous.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No OUs found.</p>
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
          {ous.map((ou) => (
            <TableRow key={ou.dn}>
              <TableCell className="font-medium">{ou.dn}</TableCell>
              {COLUMNS.slice(1).map((col) => {
                const value = (ou as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${ou.dn}-${col.key}`}>
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
