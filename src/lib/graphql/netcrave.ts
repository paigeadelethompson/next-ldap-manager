// Netcrave GraphQL schema, queries, mutations, and resolvers

export const typeDefs = `
  # Netcrave Types
  type NetcraveTemplate {
    dn: String!
    name: String!
    description: String
    subject: String
    keyType: String
    keySize: Int
    validityDays: Int
    extensions: JSON
  }

  type NetcraveCertificate {
    dn: String!
    cn: String!
    serialNumber: String!
    issuer: String!
    subject: String!
    notBefore: String!
    notAfter: String!
    status: String
    keyType: String
    keySize: Int
    san: [String]
    crlDistributionPoints: [String]
    ocspResponder: String
  }

  type NetcraveIcapService {
    dn: String!
    name: String!
    hostname: String!
    port: Int!
    uri: String
    version: String
    enabled: Boolean
  }

  extend type Query {
    # Templates
    netcraveTemplates(filter: String): [NetcraveTemplate]!
    netcraveTemplate(dn: String!): NetcraveTemplate

    # Certificates
    netcraveCertificates(filter: String, status: String): [NetcraveCertificate]!
    netcraveCertificate(dn: String!): NetcraveCertificate

    # ICAP Services
    netcraveIcapServices(filter: String): [NetcraveIcapService]!
    netcraveIcapService(dn: String!): NetcraveIcapService
  }

  extend type Mutation {
    # Template operations
    createNetcraveTemplate(input: CreateTemplateInput!): NetcraveTemplate!
    updateNetcraveTemplate(dn: String!, input: UpdateTemplateInput!): NetcraveTemplate!
    deleteNetcraveTemplate(dn: String!): Boolean!

    # Certificate operations
    issueNetcraveCertificate(input: IssueCertificateInput!): NetcraveCertificate!
    revokeNetcraveCertificate(dn: String!, reason: String): NetcraveCertificate!
    restoreNetcraveCertificate(dn: String!): NetcraveCertificate!

    # ICAP Service operations
    createNetcraveIcapService(input: CreateIcapServiceInput!): NetcraveIcapService!
    updateNetcraveIcapService(dn: String!, input: UpdateIcapServiceInput!): NetcraveIcapService!
    deleteNetcraveIcapService(dn: String!): Boolean!
  }

  input CreateTemplateInput {
    name: String!
    description: String
    subject: String
    keyType: String
    keySize: Int
    validityDays: Int
    extensions: JSON
  }

  input UpdateTemplateInput {
    description: String
    subject: String
    keyType: String
    keySize: Int
    validityDays: Int
    extensions: JSON
  }

  input IssueCertificateInput {
    templateDn: String!
    cn: String!
    san: [String]
    validityDays: Int
  }

  input CreateIcapServiceInput {
    name: String!
    hostname: String!
    port: Int!
    uri: String
    version: String
    enabled: Boolean
  }

  input UpdateIcapServiceInput {
    hostname: String
    port: Int
    uri: String
    version: String
    enabled: Boolean
  }
`;

export const queries = {};

export const mutations = {};

export const resolvers = {};

// Netcrave GraphQL queries and mutations for client-side use

export const CREATE_NETCRAVE_TEMPLATE_MUTATION = `
  mutation CreateNetcraveTemplate($input: CreateTemplateInput!) {
    createNetcraveTemplate(input: $input) {
      dn
      name
      description
      subject
      keyType
      keySize
      validityDays
      extensions
    }
  }
`;

export const UPDATE_NETCRAVE_TEMPLATE_MUTATION = `
  mutation UpdateNetcraveTemplate($dn: String!, $input: UpdateTemplateInput!) {
    updateNetcraveTemplate(dn: $dn, input: $input) {
      dn
      name
      description
      subject
      keyType
      keySize
      validityDays
      extensions
    }
  }
`;

export const DELETE_NETCRAVE_TEMPLATE_MUTATION = `
  mutation DeleteNetcraveTemplate($dn: String!) {
    deleteNetcraveTemplate(dn: $dn)
  }
`;

export const ISSUE_NETCRAVE_CERTIFICATE_MUTATION = `
  mutation IssueNetcraveCertificate($input: IssueCertificateInput!) {
    issueNetcraveCertificate(input: $input) {
      dn
      cn
      serialNumber
      issuer
      subject
      notBefore
      notAfter
      status
      keyType
      keySize
      san
      crlDistributionPoints
      ocspResponder
    }
  }
`;

export const REVOKE_NETCRAVE_CERTIFICATE_MUTATION = `
  mutation RevokeNetcraveCertificate($dn: String!, $reason: String) {
    revokeNetcraveCertificate(dn: $dn, reason: $reason) {
      dn
      cn
      status
    }
  }
`;

export const RESTORE_NETCRAVE_CERTIFICATE_MUTATION = `
  mutation RestoreNetcraveCertificate($dn: String!) {
    restoreNetcraveCertificate(dn: $dn) {
      dn
      cn
      status
    }
  }
`;

export const CREATE_NETCRAVE_ICAP_SERVICE_MUTATION = `
  mutation CreateNetcraveIcapService($input: CreateIcapServiceInput!) {
    createNetcraveIcapService(input: $input) {
      dn
      name
      hostname
      port
      uri
      version
      enabled
    }
  }
`;

export const UPDATE_NETCRAVE_ICAP_SERVICE_MUTATION = `
  mutation UpdateNetcraveIcapService($dn: String!, $input: UpdateIcapServiceInput!) {
    updateNetcraveIcapService(dn: $dn, input: $input) {
      dn
      name
      hostname
      port
      uri
      version
      enabled
    }
  }
`;

export const DELETE_NETCRAVE_ICAP_SERVICE_MUTATION = `
  mutation DeleteNetcraveIcapService($dn: String!) {
    deleteNetcraveIcapService(dn: $dn)
  }
`;

export const FETCH_NETCRAVE_TEMPLATES_QUERY = `
  query NetcraveTemplates($filter: String) {
    netcraveTemplates(filter: $filter) {
      dn
      name
      description
      subject
      keyType
      keySize
      validityDays
      extensions
    }
  }
`;

export const FETCH_NETCRAVE_CERTIFICATES_QUERY = `
  query NetcraveCertificates($filter: String, $status: String) {
    netcraveCertificates(filter: $filter, status: $status) {
      dn
      cn
      serialNumber
      issuer
      subject
      notBefore
      notAfter
      status
      keyType
      keySize
      san
      crlDistributionPoints
      ocspResponder
    }
  }
`;

export const FETCH_NETCRAVE_ICAP_SERVICES_QUERY = `
  query NetcraveIcapServices($filter: String) {
    netcraveIcapServices(filter: $filter) {
      dn
      name
      hostname
      port
      uri
      version
      enabled
    }
  }
`;
