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

// Sendmail GraphQL queries and mutations for client-side use

export const CREATE_SENDMAIL_ALIAS_MUTATION = `
  mutation CreateSendmailAlias($input: CreateAliasInput!) {
    createSendmailAlias(input: $input) {
      dn
      maildrop
      objectClass
      mail
      description
    }
  }
`;

export const UPDATE_SENDMAIL_ALIAS_MUTATION = `
  mutation UpdateSendmailAlias($dn: String!, $input: UpdateAliasInput!) {
    updateSendmailAlias(dn: $dn, input: $input) {
      dn
      maildrop
      objectClass
      mail
      description
    }
  }
`;

export const DELETE_SENDMAIL_ALIAS_MUTATION = `
  mutation DeleteSendmailAlias($dn: String!) {
    deleteSendmailAlias(dn: $dn)
  }
`;

export const CREATE_SENDMAIL_MAP_MUTATION = `
  mutation CreateSendmailMap($input: CreateMapInput!) {
    createSendmailMap(input: $input) {
      dn
      mapName
      key
      value
      description
    }
  }
`;

export const UPDATE_SENDMAIL_MAP_MUTATION = `
  mutation UpdateSendmailMap($dn: String!, $input: UpdateMapInput!) {
    updateSendmailMap(dn: $dn, input: $input) {
      dn
      mapName
      key
      value
      description
    }
  }
`;

export const DELETE_SENDMAIL_MAP_MUTATION = `
  mutation DeleteSendmailMap($dn: String!) {
    deleteSendmailMap(dn: $dn)
  }
`;

export const CREATE_SENDMAIL_CLASS_MUTATION = `
  mutation CreateSendmailClass($input: CreateClassInput!) {
    createSendmailClass(input: $input) {
      dn
      className
      members
      description
    }
  }
`;

export const UPDATE_SENDMAIL_CLASS_MUTATION = `
  mutation UpdateSendmailClass($dn: String!, $input: UpdateClassInput!) {
    updateSendmailClass(dn: $dn, input: $input) {
      dn
      className
      members
      description
    }
  }
`;

export const DELETE_SENDMAIL_CLASS_MUTATION = `
  mutation DeleteSendmailClass($dn: String!) {
    deleteSendmailClass(dn: $dn)
  }
`;

export const FETCH_SENDMAIL_ALIASES_QUERY = `
  query SendmailAliases($filter: String, $mail: String) {
    sendmailAliases(filter: $filter, mail: $mail) {
      dn
      maildrop
      objectClass
      mail
      description
    }
  }
`;

export const FETCH_SENDMAIL_MAPS_QUERY = `
  query SendmailMaps($mapName: String, $filter: String) {
    sendmailMaps(mapName: $mapName, filter: $filter) {
      dn
      mapName
      key
      value
      description
    }
  }
`;

export const FETCH_SENDMAIL_CLASSES_QUERY = `
  query SendmailClasses($filter: String) {
    sendmailClasses(filter: $filter) {
      dn
      className
      members
      description
    }
  }
`;
