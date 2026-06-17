// Sendmail GraphQL schema, queries, mutations, and resolvers

export const typeDefs = `
  # Sendmail Types
  type SendmailAlias {
    dn: String!
    maildrop: String!
    objectClass: String!
    mail: String
    description: String
  }

  type SendmailMap {
    dn: String!
    mapName: String!
    key: String!
    value: String!
    description: String
  }

  type SendmailClass {
    dn: String!
    className: String!
    members: [String]
    description: String
  }

  extend type Query {
    # Aliases
    sendmailAliases(filter: String, mail: String): [SendmailAlias]!
    sendmailAlias(dn: String!): SendmailAlias

    # Maps
    sendmailMaps(mapName: String, filter: String): [SendmailMap]!
    sendmailMap(dn: String!): SendmailMap

    # Classes
    sendmailClasses(filter: String): [SendmailClass]!
    sendmailClass(dn: String!): SendmailClass
  }

  extend type Mutation {
    # Alias operations
    createSendmailAlias(input: CreateAliasInput!): SendmailAlias!
    updateSendmailAlias(dn: String!, input: UpdateAliasInput!): SendmailAlias!
    deleteSendmailAlias(dn: String!): Boolean!

    # Map operations
    createSendmailMap(input: CreateMapInput!): SendmailMap!
    updateSendmailMap(dn: String!, input: UpdateMapInput!): SendmailMap!
    deleteSendmailMap(dn: String!): Boolean!

    # Class operations
    createSendmailClass(input: CreateClassInput!): SendmailClass!
    updateSendmailClass(dn: String!, input: UpdateClassInput!): SendmailClass!
    deleteSendmailClass(dn: String!): Boolean!
  }

  input CreateAliasInput {
    maildrop: String!
    mail: String
    description: String
  }

  input UpdateAliasInput {
    maildrop: String
    mail: String
    description: String
  }

  input CreateMapInput {
    mapName: String!
    key: String!
    value: String!
    description: String
  }

  input UpdateMapInput {
    key: String
    value: String
    description: String
  }

  input CreateClassInput {
    className: String!
    members: [String]
    description: String
  }

  input UpdateClassInput {
    members: [String]
    description: String
  }
`;

export const queries = {};

export const mutations = {};

export const resolvers = {};
