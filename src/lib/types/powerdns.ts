// PowerDNS LDAP types

export interface PowerDnsZone {
  dn: string;
  name: string;
  type?: string;
  serial?: number;
  refresh?: number;
  retry?: number;
  expire?: number;
  minimum?: number;
  ttl?: number;
  defaultTtl?: number;
  soa?: string;
  master?: string;
  nsec3param?: string;
  nsec3narrow?: boolean;
  presigned?: boolean;
  kind?: string;
}

export interface PowerDnsRecord {
  dn: string;
  zoneName: string;
  name: string;
  type: string;
  ttl?: number;
  priority?: number;
  content: string;
  disabled?: boolean;
}

// Input types for Zone operations
export interface CreateZoneInput {
  name: string;
  type?: string;
  ttl?: number;
  soa?: string;
  master?: string;
  nsec3param?: string;
  nsec3narrow?: boolean;
  presigned?: boolean;
  kind?: string;
}

export interface UpdateZoneInput {
  type?: string;
  ttl?: number;
  soa?: string;
  master?: string;
  nsec3param?: string;
  nsec3narrow?: boolean;
  presigned?: boolean;
  kind?: string;
}

// Input types for Record operations
export interface CreateRecordInput {
  zoneName: string;
  name: string;
  type: string;
  ttl?: number;
  priority?: number;
  content: string;
  disabled?: boolean;
}

export interface UpdateRecordInput {
  ttl?: number;
  priority?: number;
  content?: string;
  disabled?: boolean;
}
