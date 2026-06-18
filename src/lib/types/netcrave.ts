// Netcrave LDAP types (Certificates, ICAP)

export interface NetcraveTemplate {
  dn: string;
  name: string;
  description?: string;
  subject?: string;
  keyType?: string;
  keySize?: number;
  validityDays?: number;
  extensions?: Record<string, unknown>;
}

export interface NetcraveCertificate {
  dn: string;
  cn: string;
  serialNumber: string;
  issuer: string;
  subject: string;
  notBefore: string;
  notAfter: string;
  status?: string;
  keyType?: string;
  keySize?: number;
  san?: string[];
  crlDistributionPoints?: string[];
  ocspResponder?: string;
}

export interface NetcraveIcapService {
  dn: string;
  name: string;
  hostname: string;
  port: number;
  uri?: string;
  version?: string;
  enabled?: boolean;
}

// Input types for Template operations
export interface CreateTemplateInput {
  name: string;
  description?: string;
  subject?: string;
  keyType?: string;
  keySize?: number;
  validityDays?: number;
  extensions?: Record<string, unknown>;
}

export interface UpdateTemplateInput {
  description?: string;
  subject?: string;
  keyType?: string;
  keySize?: number;
  validityDays?: number;
  extensions?: Record<string, unknown>;
}

// Input types for Certificate operations
export interface IssueCertificateInput {
  templateDn: string;
  cn: string;
  san?: string[];
  validityDays?: number;
}

export interface RevokeCertificateInput {
  reason?: string;
}

export interface RestoreCertificateInput {}

// Input types for ICAP Service operations
export interface CreateIcapServiceInput {
  name: string;
  hostname: string;
  port: number;
  uri?: string;
  version?: string;
  enabled?: boolean;
}

export interface UpdateIcapServiceInput {
  hostname?: string;
  port?: number;
  uri?: string;
  version?: string;
  enabled?: boolean;
}
