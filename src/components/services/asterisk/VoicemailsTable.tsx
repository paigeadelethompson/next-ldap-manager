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
  { header: "Voicemail ID", key: "voicemail_id" },
  { header: "Name", key: "fullname" },
  { header: "Email", key: "email" },
];

interface Voicemail {
  voicemail_id: string;
  fullname?: string;
  email?: string;
}

interface VoicemailsTableProps {
  voicemails: Voicemail[];
  loading: boolean;
  error: string | null;
}

export function VoicemailsTable({ voicemails, loading, error }: VoicemailsTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading voicemails..." />
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

  if (voicemails.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No voicemails found.</p>
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
          {voicemails.map((vm) => (
            <TableRow key={vm.voicemail_id}>
              {COLUMNS.map((col) => {
                const value = (vm as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${vm.voicemail_id}-${col.key}`}>
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
