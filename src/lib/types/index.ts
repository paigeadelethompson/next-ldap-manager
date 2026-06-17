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

// Common input types for forms
export interface CreateUserInput {
  cn: string;
  uid?: string;
  mail?: string;
  userPassword?: string;
  objectClass?: string[];
}

export interface UpdateUserInput {
  cn?: string;
  uid?: string;
  mail?: string;
  userPassword?: string;
}

export interface CreateGroupInput {
  cn: string;
  gidNumber?: string;
  memberUid?: string[];
  objectClass?: string[];
}

export interface UpdateGroupInput {
  cn?: string;
  gidNumber?: string;
  memberUid?: string[];
}

// Generic entry types
export interface EntryFilter {
  baseDN: string;
  filter: string;
  scope?: 'base' | 'onelevel' | 'subtree';
  attributes?: string[];
}
