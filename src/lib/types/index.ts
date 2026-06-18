// Common types for LDAP Manager

export interface LdapConfig {
  url: string;
  bindDN: string;
  bindPassword?: string;
  tlsRejectUnauthorized: boolean;
}

export interface SearchResult<T = Record<string, unknown>> {
  dn: string;
  attributes: T;
}

export interface PagedResult<T = Record<string, unknown>> {
  entries: SearchResult<T>[];
  cookie?: string;
}

// Common LDAP operation results
export interface LdapOperationResult {
  success: boolean;
  message?: string;
  entryDn?: string;
}

export interface CreateResult extends LdapOperationResult {
  entryDn: string;
}

export interface UpdateResult extends LdapOperationResult {
  changedAttributes: string[];
}

export interface DeleteResult extends LdapOperationResult {}

// Input types for generic LDAP entries
export interface EntryFilter {
  baseDN: string;
  filter: string;
  scope?: 'base' | 'onelevel' | 'subtree';
  attributes?: string[];
}

export interface CreateEntryInput {
  dn: string;
  attributes: Record<string, unknown>;
}

export interface UpdateEntryInput {
  changes: LdapChange[];
}

export interface LdapChange {
  attribute: string;
  values: unknown[];
  operation: 'add' | 'replace' | 'delete';
}

// Re-export service-specific types
export * from './openldap';
export * from './asterisk';
export * from './freeradius';
export * from './krb5';
export * from './netcrave';
export * from './opendkim';
export * from './powerdns';
export * from './sendmail';
