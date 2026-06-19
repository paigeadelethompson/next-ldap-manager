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
  { header: "Name", key: "cn" },
  { header: "GID", key: "gidNumber" },
  { header: "Members", key: "memberUid" },
];

interface Group {
  dn: string;
  cn?: string;
  gidNumber?: number;
  memberUid?: string[];
}

interface GroupsTableProps {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

export function GroupsTable({ groups, loading, error }: GroupsTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading groups..." />
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

  if (groups.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No groups found.</p>
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
          {groups.map((group) => (
            <TableRow key={group.dn}>
              <TableCell className="font-medium">{group.dn}</TableCell>
              {COLUMNS.slice(1).map((col) => {
                const value = (group as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${group.dn}-${col.key}`}>
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
