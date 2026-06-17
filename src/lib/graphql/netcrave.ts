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
