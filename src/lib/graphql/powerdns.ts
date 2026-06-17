// PowerDNS GraphQL schema, queries, mutations, and resolvers

export const typeDefs = `
  # PowerDNS Types
  type PowerDnsZone {
    dn: String!
    name: String!
    type: String
    serial: Int
    refresh: Int
    retry: Int
    expire: Int
    minimum: Int
    ttl: Int
    defaultTtl: Int
    soa: String
    master: String
    nsec3param: String
    nsec3narrow: Boolean
    presigned: Boolean
    kind: String
  }

  type PowerDnsRecord {
    dn: String!
    zoneName: String!
    name: String!
    type: String!
    ttl: Int
    priority: Int
    content: String!
    disabled: Boolean
  }

  extend type Query {
    # Zones
    powerdnsZones(filter: String, kind: String): [PowerDnsZone]!
    powerdnsZone(dn: String!): PowerDnsZone

    # Records
    powerdnsRecords(zoneName: String!, filter: String, type: String): [PowerDnsRecord]!
    powerdnsRecord(dn: String!): PowerDnsRecord
  }

  extend type Mutation {
    # Zone operations
    createPowerdnsZone(input: CreateZoneInput!): PowerDnsZone!
    updatePowerdnsZone(dn: String!, input: UpdateZoneInput!): PowerDnsZone!
    deletePowerdnsZone(dn: String!): Boolean!

    # Record operations
    createPowerdnsRecord(input: CreateRecordInput!): PowerDnsRecord!
    updatePowerdnsRecord(dn: String!, input: UpdateRecordInput!): PowerDnsRecord!
    deletePowerdnsRecord(dn: String!): Boolean!
  }

  input CreateZoneInput {
    name: String!
    type: String
    ttl: Int
    soa: String
    master: String
    nsec3param: String
    nsec3narrow: Boolean
    presigned: Boolean
    kind: String
  }

  input UpdateZoneInput {
    type: String
    ttl: Int
    soa: String
    master: String
    nsec3param: String
    nsec3narrow: Boolean
    presigned: Boolean
    kind: String
  }

  input CreateRecordInput {
    zoneName: String!
    name: String!
    type: String!
    ttl: Int
    priority: Int
    content: String!
    disabled: Boolean
  }

  input UpdateRecordInput {
    ttl: Int
    priority: Int
    content: String
    disabled: Boolean
  }
`;

export const queries = {};

export const mutations = {};

export const resolvers = {};
