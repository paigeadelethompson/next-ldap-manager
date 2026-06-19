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
  { header: "op", key: "op" },
  { header: "Value", key: "value" },
];

interface Attribute {
  name: string;
  op?: string;
  value?: string;
}

interface AttributesTableProps {
  attributes: Attribute[];
  loading: boolean;
  error: string | null;
}

export function AttributesTable({ attributes, loading, error }: AttributesTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading attributes..." />
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

  if (attributes.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No attributes found.</p>
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
          {attributes.map((attr) => (
            <TableRow key={`${attr.name}-${attr.op}`}>
              {COLUMNS.map((col) => {
                const value = (attr as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${attr.name}-${col.key}`}>
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
