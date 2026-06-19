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
  { header: "Common Name", key: "cn" },
  { header: "Expires", key: "expires" },
];

interface Certificate {
  name: string;
  cn?: string;
  expires?: string;
}

interface CertificatesTableProps {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;
}

export function CertificatesTable({ certificates, loading, error }: CertificatesTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading certificates..." />
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

  if (certificates.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No certificates found.</p>
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
          {certificates.map((cert) => (
            <TableRow key={cert.name}>
              {COLUMNS.map((col) => {
                const value = (cert as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${cert.name}-${col.key}`}>
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
