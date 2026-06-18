// Kerberos LDAP types

export interface Krb5Realm {
  dn: string;
  realmName: string;
  masterKeyName?: string;
  supportedKas?: string[];
  maxLife?: number;
  maxRenew?: number;
}

export interface Krb5Principal {
  dn: string;
  principalName: string;
  principalType?: string;
  keys?: Record<string, unknown>[];
  flags?: string[];
  lastSuccessfulAuth?: string;
  lastFailedAuth?: string;
  failedAuthCount?: number;
  modulus?: string;
  exponent?: string;
}

export interface Krb5Policy {
  dn: string;
  name: string;
  minPasswordLength?: number;
  minPasswordAge?: number;
  maxPasswordAge?: number;
  passwordHistoryLength?: number;
  lockoutDuration?: number;
  failedAuthCount?: number;
  resetAuthCount?: number;
}

// Input types for Realm operations
export interface CreateRealmInput {
  realmName: string;
  masterKeyName?: string;
  supportedKas?: string[];
  maxLife?: number;
  maxRenew?: number;
}

export interface UpdateRealmInput {
  masterKeyName?: string;
  supportedKas?: string[];
  maxLife?: number;
  maxRenew?: number;
}

// Input types for Principal operations
export interface CreatePrincipalInput {
  principalName: string;
  realm?: string;
  password?: string;
  flags?: string[];
}

export interface UpdatePrincipalInput {
  flags?: string[];
  keys?: Record<string, unknown>;
}

// Input types for Policy operations
export interface CreatePolicyInput {
  name: string;
  minPasswordLength?: number;
  minPasswordAge?: number;
  maxPasswordAge?: number;
  passwordHistoryLength?: number;
  lockoutDuration?: number;
  failedAuthCount?: number;
  resetAuthCount?: number;
}

export interface UpdatePolicyInput {
  minPasswordLength?: number;
  minPasswordAge?: number;
  maxPasswordAge?: number;
  passwordHistoryLength?: number;
  lockoutDuration?: number;
  failedAuthCount?: number;
  resetAuthCount?: number;
}
