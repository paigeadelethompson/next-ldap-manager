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
