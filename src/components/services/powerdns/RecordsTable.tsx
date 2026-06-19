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
  { header: "Content", key: "content" },
  { header: "TTL", key: "ttl" },
];

interface Record {
  name: string;
  type?: string;
  content?: string;
  ttl?: number;
}

interface RecordsTableProps {
  records: Record[];
  loading: boolean;
  error: string | null;
}

export function RecordsTable({ records, loading, error }: RecordsTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading records..." />
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

  if (records.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No records found.</p>
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
          {records.map((record) => (
            <TableRow key={`${record.name}-${record.type}`}>
              {COLUMNS.map((col) => {
                const value = (record as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${record.name}-${col.key}`}>
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
