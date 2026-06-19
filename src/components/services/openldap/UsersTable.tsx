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
  { header: "Common Name", key: "cn" },
  { header: "UID", key: "uid" },
  { header: "Email", key: "mail" },
  { header: "First Name", key: "givenName" },
  { header: "Last Name", key: "sn" },
  { header: "Phone", key: "telephoneNumber" },
  { header: "Title", key: "title" },
  { header: "OU", key: "ou" },
];

interface User {
  dn: string;
  cn?: string;
  uid?: string;
  mail?: string;
  givenName?: string;
  sn?: string;
  telephoneNumber?: string;
  title?: string;
  ou?: string;
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  error: string | null;
}

export function UsersTable({ users, loading, error }: UsersTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading users..." />
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

  if (users.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No users found.</p>
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
          {users.map((user) => (
            <TableRow key={user.dn}>
              <TableCell className="font-medium">{user.dn}</TableCell>
              {COLUMNS.slice(1).map((col) => {
                const value = (user as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${user.dn}-${col.key}`}>
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
