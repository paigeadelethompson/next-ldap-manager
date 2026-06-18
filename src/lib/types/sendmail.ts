// Sendmail LDAP types

export interface SendmailAlias {
  dn: string;
  maildrop: string;
  objectClass?: string;
  mail?: string;
  description?: string;
}

export interface SendmailMap {
  dn: string;
  mapName: string;
  key: string;
  value: string;
  description?: string;
}

export interface SendmailClass {
  dn: string;
  className: string;
  members?: string[];
  description?: string;
}

// Input types for Alias operations
export interface CreateAliasInput {
  maildrop: string;
  mail?: string;
  description?: string;
}

export interface UpdateAliasInput {
  maildrop?: string;
  mail?: string;
  description?: string;
}

// Input types for Map operations
export interface CreateMapInput {
  mapName: string;
  key: string;
  value: string;
  description?: string;
}

export interface UpdateMapInput {
  key?: string;
  value?: string;
  description?: string;
}

// Input types for Class operations
export interface CreateClassInput {
  className: string;
  members?: string[];
  description?: string;
}

export interface UpdateClassInput {
  members?: string[];
  description?: string;
}
