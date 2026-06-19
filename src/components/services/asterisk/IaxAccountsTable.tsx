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
  { header: "Context", key: "context" },
  { header: "Host", key: "host" },
];

interface IaxAccount {
  name: string;
  context?: string;
  host?: string;
}

interface IaxAccountsTableProps {
  iaxAccounts: IaxAccount[];
  loading: boolean;
  error: string | null;
}

export function IaxAccountsTable({ iaxAccounts, loading, error }: IaxAccountsTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading IAX accounts..." />
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

  if (iaxAccounts.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No IAX accounts found.</p>
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
          {iaxAccounts.map((acc) => (
            <TableRow key={acc.name}>
              {COLUMNS.map((col) => {
                const value = (acc as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${acc.name}-${col.key}`}>
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
