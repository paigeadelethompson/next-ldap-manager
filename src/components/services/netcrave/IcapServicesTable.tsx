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
  { header: "Host", key: "host" },
  { header: "Port", key: "port" },
];

interface IcapService {
  name: string;
  host?: string;
  port?: number;
}

interface IcapServicesTableProps {
  icapServices: IcapService[];
  loading: boolean;
  error: string | null;
}

export function IcapServicesTable({ icapServices, loading, error }: IcapServicesTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading ICAP services..." />
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

  if (icapServices.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No ICAP services found.</p>
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
          {icapServices.map((svc) => (
            <TableRow key={svc.name}>
              {COLUMNS.map((col) => {
                const value = (svc as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${svc.name}-${col.key}`}>
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
