// Kerberos GraphQL schema, queries, mutations, and resolvers

export const typeDefs = `
  # Kerberos Types
  type Krb5Realm {
    dn: String!
    realmName: String!
    masterKeyName: String
    supportedKas: [String]
    maxLife: Int
    maxRenew: Int
  }

  type Krb5Principal {
    dn: String!
    principalName: String!
    principalType: String
    keys: [JSON]
    flags: [String]
    lastSuccessfulAuth: String
    lastFailedAuth: String
    failedAuthCount: Int
    modulus: String
    exponent: String
  }

  type Krb5Policy {
    dn: String!
    name: String!
    minPasswordLength: Int
    minPasswordAge: Int
    maxPasswordAge: Int
    passwordHistoryLength: Int
    lockoutDuration: Int
    failedAuthCount: Int
    resetAuthCount: Int
  }

  extend type Query {
    # Realms
    krb5Realms(filter: String): [Krb5Realm]!
    krb5Realm(dn: String!): Krb5Realm

    # Principals
    krb5Principals(realm: String, filter: String): [Krb5Principal]!
    krb5Principal(dn: String!): Krb5Principal

    # Policies
    krb5Policies(filter: String): [Krb5Policy]!
    krb5Policy(dn: String!): Krb5Policy
  }

  extend type Mutation {
    # Realm operations
    createKrb5Realm(input: CreateRealmInput!): Krb5Realm!
    updateKrb5Realm(dn: String!, input: UpdateRealmInput!): Krb5Realm!
    deleteKrb5Realm(dn: String!): Boolean!

    # Principal operations
    createKrb5Principal(input: CreatePrincipalInput!): Krb5Principal!
    updateKrb5Principal(dn: String!, input: UpdatePrincipalInput!): Krb5Principal!
    deleteKrb5Principal(dn: String!): Boolean!
    resetKrb5PrincipalPassword(dn: String!, password: String!): Krb5Principal!

    # Policy operations
    createKrb5Policy(input: CreatePolicyInput!): Krb5Policy!
    updateKrb5Policy(dn: String!, input: UpdatePolicyInput!): Krb5Policy!
    deleteKrb5Policy(dn: String!): Boolean!
  }

  input CreateRealmInput {
    realmName: String!
    masterKeyName: String
    supportedKas: [String]
    maxLife: Int
    maxRenew: Int
  }

  input UpdateRealmInput {
    masterKeyName: String
    supportedKas: [String]
    maxLife: Int
    maxRenew: Int
  }

  input CreatePrincipalInput {
    principalName: String!
    realm: String
    password: String
    flags: [String]
  }

  input UpdatePrincipalInput {
    flags: [String]
    keys: JSON
  }

  input CreatePolicyInput {
    name: String!
    minPasswordLength: Int
    minPasswordAge: Int
    maxPasswordAge: Int
    passwordHistoryLength: Int
    lockoutDuration: Int
    failedAuthCount: Int
    resetAuthCount: Int
  }

  input UpdatePolicyInput {
    minPasswordLength: Int
    minPasswordAge: Int
    maxPasswordAge: Int
    passwordHistoryLength: Int
    lockoutDuration: Int
    failedAuthCount: Int
    resetAuthCount: Int
  }
`;

export const queries = {};

export const mutations = {};

export const resolvers = {};

// Kerberos GraphQL queries and mutations for client-side use

export const CREATE_KRB5_REALM_MUTATION = `
  mutation CreateKrb5Realm($input: CreateRealmInput!) {
    createKrb5Realm(input: $input) {
      dn
      realmName
      masterKeyName
      supportedKas
      maxLife
      maxRenew
    }
  }
`;

export const UPDATE_KRB5_REALM_MUTATION = `
  mutation UpdateKrb5Realm($dn: String!, $input: UpdateRealmInput!) {
    updateKrb5Realm(dn: $dn, input: $input) {
      dn
      realmName
      masterKeyName
      supportedKas
      maxLife
      maxRenew
    }
  }
`;

export const DELETE_KRB5_REALM_MUTATION = `
  mutation DeleteKrb5Realm($dn: String!) {
    deleteKrb5Realm(dn: $dn)
  }
`;

export const CREATE_KRB5_PRINCIPAL_MUTATION = `
  mutation CreateKrb5Principal($input: CreatePrincipalInput!) {
    createKrb5Principal(input: $input) {
      dn
      principalName
      principalType
      keys
      flags
      lastSuccessfulAuth
      lastFailedAuth
      failedAuthCount
      modulus
      exponent
    }
  }
`;

export const UPDATE_KRB5_PRINCIPAL_MUTATION = `
  mutation UpdateKrb5Principal($dn: String!, $input: UpdatePrincipalInput!) {
    updateKrb5Principal(dn: $dn, input: $input) {
      dn
      principalName
      principalType
      keys
      flags
    }
  }
`;

export const DELETE_KRB5_PRINCIPAL_MUTATION = `
  mutation DeleteKrb5Principal($dn: String!) {
    deleteKrb5Principal(dn: $dn)
  }
`;

export const RESET_KRB5_PRINCIPAL_PASSWORD_MUTATION = `
  mutation ResetKrb5PrincipalPassword($dn: String!, $password: String!) {
    resetKrb5PrincipalPassword(dn: $dn, password: $password) {
      dn
      principalName
    }
  }
`;

export const CREATE_KRB5_POLICY_MUTATION = `
  mutation CreateKrb5Policy($input: CreatePolicyInput!) {
    createKrb5Policy(input: $input) {
      dn
      name
      minPasswordLength
      minPasswordAge
      maxPasswordAge
      passwordHistoryLength
      lockoutDuration
      failedAuthCount
      resetAuthCount
    }
  }
`;

export const UPDATE_KRB5_POLICY_MUTATION = `
  mutation UpdateKrb5Policy($dn: String!, $input: UpdatePolicyInput!) {
    updateKrb5Policy(dn: $dn, input: $input) {
      dn
      name
      minPasswordLength
      minPasswordAge
      maxPasswordAge
      passwordHistoryLength
      lockoutDuration
      failedAuthCount
      resetAuthCount
    }
  }
`;

export const DELETE_KRB5_POLICY_MUTATION = `
  mutation DeleteKrb5Policy($dn: String!) {
    deleteKrb5Policy(dn: $dn)
  }
`;

export const FETCH_KRB5_REALMS_QUERY = `
  query Krb5Realms($filter: String) {
    krb5Realms(filter: $filter) {
      dn
      realmName
      masterKeyName
      supportedKas
      maxLife
      maxRenew
    }
  }
`;

export const FETCH_KRB5_PRINCIPALS_QUERY = `
  query Krb5Principals($realm: String, $filter: String) {
    krb5Principals(realm: $realm, filter: $filter) {
      dn
      principalName
      principalType
      keys
      flags
      lastSuccessfulAuth
      lastFailedAuth
      failedAuthCount
      modulus
      exponent
    }
  }
`;

export const FETCH_KRB5_POLICIES_QUERY = `
  query Krb5Policies($filter: String) {
    krb5Policies(filter: $filter) {
      dn
      name
      minPasswordLength
      minPasswordAge
      maxPasswordAge
      passwordHistoryLength
      lockoutDuration
      failedAuthCount
      resetAuthCount
    }
  }
`;
