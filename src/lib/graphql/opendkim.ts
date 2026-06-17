// OpenDKIM GraphQL schema, queries, mutations, and resolvers

export const typeDefs = `
  # OpenDKIM Types
  type OpenDkimSelector {
    dn: String!
    selectorName: String!
    domain: String!
    keyFile: String
    key: String
    canonicHeaders: String
    canonicBody: String
    signAlgorithm: String
    subDomains: Boolean
  }

  type OpenDkimDomain {
    dn: String!
    domainName: String!
    selector: String
    keysign: String
    keyfile: String
    iua: String
  }

  type OpenDkimSigningPolicy {
    dn: String!
    domain: String!
    selector: String
    key: String
    canonic: String
    signAlgorithm: String
    subdomains: Boolean
  }

  extend type Query {
    # Selectors
    opendkimSelectors(domain: String, filter: String): [OpenDkimSelector]!
    opendkimSelector(dn: String!): OpenDkimSelector

    # Domains
    opendkimDomains(filter: String): [OpenDkimDomain]!
    opendkimDomain(dn: String!): OpenDkimDomain

    # Signing Policies
    opendkimSigningPolicies(filter: String): [OpenDkimSigningPolicy]!
    opendkimSigningPolicy(dn: String!): OpenDkimSigningPolicy
  }

  extend type Mutation {
    # Selector operations
    createOpenDkimSelector(input: CreateSelectorInput!): OpenDkimSelector!
    updateOpenDkimSelector(dn: String!, input: UpdateSelectorInput!): OpenDkimSelector!
    deleteOpenDkimSelector(dn: String!): Boolean!

    # Domain operations
    createOpenDkimDomain(input: CreateDomainInput!): OpenDkimDomain!
    updateOpenDkimDomain(dn: String!, input: UpdateDomainInput!): OpenDkimDomain!
    deleteOpenDkimDomain(dn: String!): Boolean!

    # Signing Policy operations
    createOpenDkimSigningPolicy(input: CreateSigningPolicyInput!): OpenDkimSigningPolicy!
    updateOpenDkimSigningPolicy(dn: String!, input: UpdateSigningPolicyInput!): OpenDkimSigningPolicy!
    deleteOpenDkimSigningPolicy(dn: String!): Boolean!
  }

  input CreateSelectorInput {
    selectorName: String!
    domain: String!
    keyFile: String
    key: String
    canonicHeaders: String
    canonicBody: String
    signAlgorithm: String
    subDomains: Boolean
  }

  input UpdateSelectorInput {
    keyFile: String
    key: String
    canonicHeaders: String
    canonicBody: String
    signAlgorithm: String
    subDomains: Boolean
  }

  input CreateDomainInput {
    domainName: String!
    selector: String
    keysign: String
    keyfile: String
    iua: String
  }

  input UpdateDomainInput {
    selector: String
    keysign: String
    keyfile: String
    iua: String
  }

  input CreateSigningPolicyInput {
    domain: String!
    selector: String
    key: String
    canonic: String
    signAlgorithm: String
    subdomains: Boolean
  }

  input UpdateSigningPolicyInput {
    selector: String
    key: String
    canonic: String
    signAlgorithm: String
    subdomains: Boolean
  }
`;

export const queries = {};

export const mutations = {};

export const resolvers = {};
