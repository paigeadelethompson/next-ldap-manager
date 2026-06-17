// OpenLDAP-specific types

export interface OpenLdapUser {
  dn: string;
  cn: string;
  uid?: string;
  mail?: string;
  userPassword?: string;
  objectClass: string[];
  givenName?: string;
  sn?: string;
  telephoneNumber?: string;
  title?: string;
  ou?: string;
}

export interface OpenLdapGroup {
  dn: string;
  cn: string;
  gidNumber?: string;
  memberUid?: string[];
  member?: string[];
  objectClass: string[];
  description?: string;
}

export interface OpenLdapOu {
  dn: string;
  ou: string;
  description?: string;
  objectClass: string[];
}

export interface OpenLdapEntry {
  dn: string;
  attributes: Record<string, unknown>;
}

// Input types for forms
export interface CreateUserInput {
  cn: string;
  uid?: string;
  mail?: string;
  userPassword?: string;
  givenName?: string;
  sn?: string;
  telephoneNumber?: string;
  title?: string;
  ou?: string;
}

export interface UpdateUserInput {
  cn?: string;
  uid?: string;
  mail?: string;
  userPassword?: string;
  givenName?: string;
  sn?: string;
  telephoneNumber?: string;
  title?: string;
  ou?: string;
}

export interface CreateGroupInput {
  cn: string;
  gidNumber?: string;
  memberUid?: string[];
  description?: string;
}

export interface UpdateGroupInput {
  cn?: string;
  gidNumber?: string;
  memberUid?: string[];
  description?: string;
}

export interface CreateOuInput {
  ou: string;
  description?: string;
}

export interface UpdateOuInput {
  ou?: string;
  description?: string;
}
