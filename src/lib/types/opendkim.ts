// OpenDKIM LDAP types

export interface OpenDkimSelector {
  dn: string;
  selectorName: string;
  domain: string;
  keyFile?: string;
  key?: string;
  canonicHeaders?: string;
  canonicBody?: string;
  signAlgorithm?: string;
  subDomains?: boolean;
}

export interface OpenDkimDomain {
  dn: string;
  domainName: string;
  selector?: string;
  keysign?: string;
  keyfile?: string;
  iua?: string;
}

export interface OpenDkimSigningPolicy {
  dn: string;
  domain: string;
  selector?: string;
  key?: string;
  canonic?: string;
  signAlgorithm?: string;
  subdomains?: boolean;
}

// Input types for Selector operations
export interface CreateSelectorInput {
  selectorName: string;
  domain: string;
  keyFile?: string;
  key?: string;
  canonicHeaders?: string;
  canonicBody?: string;
  signAlgorithm?: string;
  subDomains?: boolean;
}

export interface UpdateSelectorInput {
  keyFile?: string;
  key?: string;
  canonicHeaders?: string;
  canonicBody?: string;
  signAlgorithm?: string;
  subDomains?: boolean;
}

// Input types for Domain operations
export interface CreateDomainInput {
  domainName: string;
  selector?: string;
  keysign?: string;
  keyfile?: string;
  iua?: string;
}

export interface UpdateDomainInput {
  selector?: string;
  keysign?: string;
  keyfile?: string;
  iua?: string;
}

// Input types for Signing Policy operations
export interface CreateSigningPolicyInput {
  domain: string;
  selector?: string;
  key?: string;
  canonic?: string;
  signAlgorithm?: string;
  subdomains?: boolean;
}

export interface UpdateSigningPolicyInput {
  selector?: string;
  key?: string;
  canonic?: string;
  signAlgorithm?: string;
  subdomains?: boolean;
}
