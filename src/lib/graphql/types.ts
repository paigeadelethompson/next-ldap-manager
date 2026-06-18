// Base GraphQL schema for LDAP Manager
// This file defines the base Query/Mutation types that services extend

export const baseTypeDefs = `
  scalar Date
  scalar JSON

  # Generic LDAP entry type
  type LdapEntry {
    dn: String!
    attributes: JSON!
  }

  input LdapChangeInput {
    attribute: String!
    values: [JSON]!
    operation: String! # add, replace, delete
  }

  type Query {
    # Generic entries
    ldapEntries(baseDN: String!, filter: String, scope: String, attributes: [String]): [LdapEntry]!
  }

  type Mutation {
    # Generic entry operations
    createLdapEntry(dn: String!, attributes: JSON!): LdapEntry!
    updateLdapEntry(dn: String!, changes: [LdapChangeInput!]!): LdapEntry!
    deleteLdapEntry(dn: String!): Boolean!
  }
`;
