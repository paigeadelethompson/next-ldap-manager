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

const getBaseDN = () => {
  const baseDN = process.env.LDAP_BASE_DN || "dc=netcrave,dc=local";
  return baseDN;
};

export const queries = {
  powerdnsZones: async (
    _parent: unknown,
    args: { filter?: string; kind?: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const baseDN = `ou=zones,${getBaseDN()}`;
    const filter = args.filter || "(objectClass=dNSZone)";
    return await context.ldapClient.search({
      baseDN,
      filter,
      scope: "subtree",
      attributes: ["*"],
    });
  },

  powerdnsZone: async (
    _parent: unknown,
    args: { dn: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const filter = `(dn=${args.dn})`;
    const results = await context.ldapClient.search({
      baseDN: args.dn,
      filter,
      scope: "base",
      attributes: ["*"],
    });
    return results.length > 0 ? results[0] : null;
  },

  powerdnsRecords: async (
    _parent: unknown,
    args: { zoneName: string; filter?: string; type?: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const baseDN = `ou=records,${getBaseDN()}`;
    let filter = args.filter || "(objectClass=dNSRecord)";
    if (args.type) {
      filter = `(&(objectClass=dNSRecord)(rRType=${args.type}))`;
    }
    return await context.ldapClient.search({
      baseDN,
      filter,
      scope: "subtree",
      attributes: ["*"],
    });
  },

  powerdnsRecord: async (
    _parent: unknown,
    args: { dn: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const filter = `(dn=${args.dn})`;
    const results = await context.ldapClient.search({
      baseDN: args.dn,
      filter,
      scope: "base",
      attributes: ["*"],
    });
    return results.length > 0 ? results[0] : null;
  },
};

export const mutations = {
  createPowerdnsZone: async (
    _parent: unknown,
    args: { input: any },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const {
      name,
      type,
      ttl,
      soa,
      master,
      nsec3param,
      nsec3narrow,
      presigned,
      kind,
    } = args.input;
    const baseDN = getBaseDN();
    const zoneDN = `zoneName=${name},ou=zones,${baseDN}`;

    const attributes: Record<string, string | string[]> = {
      objectClass: ["dNSZone", "top"],
      zoneName: name,
    };

    if (type) attributes.zoneType = type;
    if (ttl) attributes.serial = String(ttl);
    if (soa) attributes.soaRecord = soa;
    if (master) attributes.masterServer = master;

    await context.ldapClient.add(zoneDN, attributes);

    return { dn: zoneDN, name, type, ttl, soa, master };
  },

  updatePowerdnsZone: async (
    _parent: unknown,
    args: { dn: string; input: any },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const changes = Object.entries(args.input).map(([key, value]) => ({
      attribute: key,
      values: Array.isArray(value) ? value : [String(value)],
      operation: "replace" as const,
    }));
    await context.ldapClient.modify(args.dn, changes);
    return { dn: args.dn, ...args.input };
  },

  deletePowerdnsZone: async (
    _parent: unknown,
    args: { dn: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    await context.ldapClient.delete(args.dn);
    return true;
  },

  createPowerdnsRecord: async (
    _parent: unknown,
    args: { input: any },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const { zoneName, name, type, ttl, priority, content, disabled } =
      args.input;
    const baseDN = getBaseDN();
    const recordDN = `rname=${name},ou=records,${baseDN}`;

    const attributes: Record<string, string | string[]> = {
      objectClass: ["dNSRecord", "top"],
      zoneName: zoneName,
      rName: name,
      rRType: type,
      rRContent: content,
    };

    if (ttl) attributes.rRTTL = String(ttl);
    if (priority !== undefined) attributes.rRPriority = String(priority);
    if (disabled !== undefined) attributes.rRDisabled = String(disabled);

    await context.ldapClient.add(recordDN, attributes);

    return {
      dn: recordDN,
      zoneName,
      name,
      type,
      ttl,
      priority,
      content,
      disabled,
    };
  },

  updatePowerdnsRecord: async (
    _parent: unknown,
    args: { dn: string; input: any },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const changes = Object.entries(args.input).map(([key, value]) => ({
      attribute: key,
      values: Array.isArray(value) ? value : [String(value)],
      operation: "replace" as const,
    }));
    await context.ldapClient.modify(args.dn, changes);
    return { dn: args.dn, ...args.input };
  },

  deletePowerdnsRecord: async (
    _parent: unknown,
    args: { dn: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    await context.ldapClient.delete(args.dn);
    return true;
  },
};

export const resolvers = {};

// PowerDNS GraphQL queries and mutations for client-side use

export const CREATE_POWERDNS_ZONE_MUTATION = `
  mutation CreatePowerdnsZone($input: CreateZoneInput!) {
    createPowerdnsZone(input: $input) {
      dn
      name
      type
      ttl
      soa
      master
      nsec3param
      nsec3narrow
      presigned
      kind
    }
  }
`;

export const UPDATE_POWERDNS_ZONE_MUTATION = `
  mutation UpdatePowerdnsZone($dn: String!, $input: UpdateZoneInput!) {
    updatePowerdnsZone(dn: $dn, input: $input) {
      dn
      name
      type
      ttl
      soa
      master
      nsec3param
      nsec3narrow
      presigned
      kind
    }
  }
`;

export const DELETE_POWERDNS_ZONE_MUTATION = `
  mutation DeletePowerdnsZone($dn: String!) {
    deletePowerdnsZone(dn: $dn)
  }
`;

export const CREATE_POWERDNS_RECORD_MUTATION = `
  mutation CreatePowerdnsRecord($input: CreateRecordInput!) {
    createPowerdnsRecord(input: $input) {
      dn
      zoneName
      name
      type
      ttl
      priority
      content
      disabled
    }
  }
`;

export const UPDATE_POWERDNS_RECORD_MUTATION = `
  mutation UpdatePowerdnsRecord($dn: String!, $input: UpdateRecordInput!) {
    updatePowerdnsRecord(dn: $dn, input: $input) {
      dn
      zoneName
      name
      type
      ttl
      priority
      content
      disabled
    }
  }
`;

export const DELETE_POWERDNS_RECORD_MUTATION = `
  mutation DeletePowerdnsRecord($dn: String!) {
    deletePowerdnsRecord(dn: $dn)
  }
`;

export const FETCH_POWERDNS_ZONES_QUERY = `
  query PowerdnsZones($filter: String, $kind: String) {
    powerdnsZones(filter: $filter, kind: $kind) {
      dn
      name
      type
      ttl
      soa
      master
      nsec3param
      nsec3narrow
      presigned
      kind
    }
  }
`;

export const FETCH_POWERDNS_RECORDS_QUERY = `
  query PowerdnsRecords($zoneName: String!, $filter: String, $type: String) {
    powerdnsRecords(zoneName: $zoneName, filter: $filter, type: $type) {
      dn
      zoneName
      name
      type
      ttl
      priority
      content
      disabled
    }
  }
`;
