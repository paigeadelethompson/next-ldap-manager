// FreeRADIUS LDAP types

export interface FreeradiusProfile {
  dn: string;
  name: string;
  description?: string;
  attributes?: Record<string, unknown>;
}

export interface FreeradiusNas {
  dn: string;
  nasname: string;
  shortname?: string;
  type?: string;
  secret?: string;
  description?: string;
  radiusclientid?: string;
}

export interface FreeradiusAttribute {
  dn: string;
  username: string;
  attribute: string;
  operator: string;
  value: string;
}

// Input types for Profile operations
export interface CreateProfileInput {
  name: string;
  description?: string;
  attributes?: Record<string, unknown>;
}

export interface UpdateProfileInput {
  description?: string;
  attributes?: Record<string, unknown>;
}

// Input types for NAS operations
export interface CreateNasInput {
  nasname: string;
  shortname?: string;
  type?: string;
  secret?: string;
  description?: string;
  radiusclientid?: string;
}

export interface UpdateNasInput {
  shortname?: string;
  type?: string;
  secret?: string;
  description?: string;
  radiusclientid?: string;
}

// Input types for Attribute operations
export interface CreateAttributeInput {
  username: string;
  attribute: string;
  operator: string;
  value: string;
}

export interface UpdateAttributeInput {
  attribute?: string;
  operator?: string;
  value?: string;
}
