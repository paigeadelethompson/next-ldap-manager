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

// OpenDKIM GraphQL queries and mutations for client-side use

export const CREATE_OPENDKIM_SELECTOR_MUTATION = `
  mutation CreateOpenDkimSelector($input: CreateSelectorInput!) {
    createOpenDkimSelector(input: $input) {
      dn
      selectorName
      domain
      keyFile
      key
      canonicHeaders
      canonicBody
      signAlgorithm
      subDomains
    }
  }
`;

export const UPDATE_OPENDKIM_SELECTOR_MUTATION = `
  mutation UpdateOpenDkimSelector($dn: String!, $input: UpdateSelectorInput!) {
    updateOpenDkimSelector(dn: $dn, input: $input) {
      dn
      selectorName
      domain
      keyFile
      key
      canonicHeaders
      canonicBody
      signAlgorithm
      subDomains
    }
  }
`;

export const DELETE_OPENDKIM_SELECTOR_MUTATION = `
  mutation DeleteOpenDkimSelector($dn: String!) {
    deleteOpenDkimSelector(dn: $dn)
  }
`;

export const CREATE_OPENDKIM_DOMAIN_MUTATION = `
  mutation CreateOpenDkimDomain($input: CreateDomainInput!) {
    createOpenDkimDomain(input: $input) {
      dn
      domainName
      selector
      keysign
      keyfile
      iua
    }
  }
`;

export const UPDATE_OPENDKIM_DOMAIN_MUTATION = `
  mutation UpdateOpenDkimDomain($dn: String!, $input: UpdateDomainInput!) {
    updateOpenDkimDomain(dn: $dn, input: $input) {
      dn
      domainName
      selector
      keysign
      keyfile
      iua
    }
  }
`;

export const DELETE_OPENDKIM_DOMAIN_MUTATION = `
  mutation DeleteOpenDkimDomain($dn: String!) {
    deleteOpenDkimDomain(dn: $dn)
  }
`;

export const CREATE_OPENDKIM_SIGNING_POLICY_MUTATION = `
  mutation CreateOpenDkimSigningPolicy($input: CreateSigningPolicyInput!) {
    createOpenDkimSigningPolicy(input: $input) {
      dn
      domain
      selector
      key
      canonic
      signAlgorithm
      subdomains
    }
  }
`;

export const UPDATE_OPENDKIM_SIGNING_POLICY_MUTATION = `
  mutation UpdateOpenDkimSigningPolicy($dn: String!, $input: UpdateSigningPolicyInput!) {
    updateOpenDkimSigningPolicy(dn: $dn, input: $input) {
      dn
      domain
      selector
      key
      canonic
      signAlgorithm
      subdomains
    }
  }
`;

export const DELETE_OPENDKIM_SIGNING_POLICY_MUTATION = `
  mutation DeleteOpenDkimSigningPolicy($dn: String!) {
    deleteOpenDkimSigningPolicy(dn: $dn)
  }
`;

export const FETCH_OPENDKIM_SELECTORS_QUERY = `
  query OpenDkimSelectors($domain: String, $filter: String) {
    opendkimSelectors(domain: $domain, filter: $filter) {
      dn
      selectorName
      domain
      keyFile
      key
      canonicHeaders
      canonicBody
      signAlgorithm
      subDomains
    }
  }
`;

export const FETCH_OPENDKIM_DOMAINS_QUERY = `
  query OpenDkimDomains($filter: String) {
    opendkimDomains(filter: $filter) {
      dn
      domainName
      selector
      keysign
      keyfile
      iua
    }
  }
`;

export const FETCH_OPENDKIM_SIGNING_POLICIES_QUERY = `
  query OpenDkimSigningPolicies($filter: String) {
    opendkimSigningPolicies(filter: $filter) {
      dn
      domain
      selector
      key
      canonic
      signAlgorithm
      subdomains
    }
  }
`;
