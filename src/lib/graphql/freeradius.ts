// FreeRADIUS GraphQL schema, queries, mutations, and resolvers

export const typeDefs = `
  # FreeRADIUS Types
  type FreeradiusProfile {
    dn: String!
    name: String!
    description: String
    attributes: JSON
  }

  type FreeradiusNas {
    dn: String!
    nasname: String!
    shortname: String
    type: String
    secret: String
    description: String
    radiusclientid: String
  }

  type FreeradiusAttribute {
    dn: String!
    username: String!
    attribute: String!
    operator: String!
    value: String!
  }

  extend type Query {
    # Profiles
    freeradiusProfiles(filter: String): [FreeradiusProfile]!
    freeradiusProfile(dn: String!): FreeradiusProfile

    # NAS Clients
    freeradiusNas(filter: String): [FreeradiusNas]!
    freeradiusNas(nasname: String!): FreeradiusNas

    # User Attributes
    freeradiusAttributes(username: String!, filter: String): [FreeradiusAttribute]!
  }

  extend type Mutation {
    # Profile operations
    createFreeradiusProfile(input: CreateProfileInput!): FreeradiusProfile!
    updateFreeradiusProfile(dn: String!, input: UpdateProfileInput!): FreeradiusProfile!
    deleteFreeradiusProfile(dn: String!): Boolean!

    # NAS operations
    createFreeradiusNas(input: CreateNasInput!): FreeradiusNas!
    updateFreeradiusNas(nasname: String!, input: UpdateNasInput!): FreeradiusNas!
    deleteFreeradiusNas(nasname: String!): Boolean!

    # Attribute operations
    createFreeradiusAttribute(input: CreateAttributeInput!): FreeradiusAttribute!
    updateFreeradiusAttribute(dn: String!, input: UpdateAttributeInput!): FreeradiusAttribute!
    deleteFreeradiusAttribute(dn: String!): Boolean!
  }

  input CreateProfileInput {
    name: String!
    description: String
    attributes: JSON
  }

  input UpdateProfileInput {
    description: String
    attributes: JSON
  }

  input CreateNasInput {
    nasname: String!
    shortname: String
    type: String
    secret: String
    description: String
    radiusclientid: String
  }

  input UpdateNasInput {
    shortname: String
    type: String
    secret: String
    description: String
    radiusclientid: String
  }

  input CreateAttributeInput {
    username: String!
    attribute: String!
    operator: String!
    value: String!
  }

  input UpdateAttributeInput {
    attribute: String
    operator: String
    value: String
  }
`;

export const queries = {};

export const mutations = {};

export const resolvers = {};
