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
  { header: "Type", key: "type" },
  { header: "Records", key: "records" },
  { header: "Changed", key: "changed" },
];

interface Zone {
  name: string;
  type?: string;
  records?: number;
  changed?: string;
}

interface ZonesTableProps {
  zones: Zone[];
  loading: boolean;
  error: string | null;
}

export function ZonesTable({ zones, loading, error }: ZonesTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading zones..." />
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

  if (zones.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No zones found.</p>
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
          {zones.map((zone) => (
            <TableRow key={zone.name}>
              {COLUMNS.map((col) => {
                const value = (zone as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${zone.name}-${col.key}`}>
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
