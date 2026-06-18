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
    freeradiusNases(filter: String): [FreeradiusNas]!
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

const getBaseDN = () => {
  const baseDN = process.env.LDAP_BASE_DN || 'dc=netcrave,dc=local';
  return baseDN;
};

export const queries = {
  freeradiusProfiles: async (_parent: unknown, args: { filter?: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const baseDN = `ou=profiles,${getBaseDN()}`;
    const filter = args.filter || '(objectClass=radiusProfile)';
    return await context.ldapClient.search({ baseDN, filter, scope: 'subtree', attributes: ['*'] });
  },

  freeradiusProfile: async (_parent: unknown, args: { dn: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const filter = `(dn=${args.dn})`;
    const results = await context.ldapClient.search({ baseDN: args.dn, filter, scope: 'base', attributes: ['*'] });
    return results.length > 0 ? results[0] : null;
  },

  freeradiusNases: async (_parent: unknown, args: { filter?: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const baseDN = `ou=nas,${getBaseDN()}`;
    const filter = args.filter || '(objectClass=radiusNAS)';
    return await context.ldapClient.search({ baseDN, filter, scope: 'subtree', attributes: ['*'] });
  },

  freeradiusNas: async (_parent: unknown, args: { nasname: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const baseDN = `ou=nas,${getBaseDN()}`;
    const filter = `(nasName=${args.nasname})`;
    const results = await context.ldapClient.search({ baseDN, filter, scope: 'subtree', attributes: ['*'] });
    return results.length > 0 ? results[0] : null;
  },

  freeradiusAttributes: async (_parent: unknown, args: { username: string; filter?: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const baseDN = `ou=attributes,${getBaseDN()}`;
    const filter = args.filter || `(objectClass=radiusAttribute)`;
    return await context.ldapClient.search({ baseDN, filter, scope: 'subtree', attributes: ['*'] });
  },
};

export const mutations = {
  createFreeradiusProfile: async (_parent: unknown, args: { input: any }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const { name, description, attributes } = args.input;
    const baseDN = getBaseDN();
    const profileDN = `cn=${name},ou=profiles,${baseDN}`;

    const ldapAttrs: Record<string, string | string[]> = {
      objectClass: ['radiusProfile', 'top'],
      cn: name,
    };
    if (description) ldapAttrs.description = description;
    if (attributes) ldapAttrs.attributes = JSON.stringify(attributes);

    await context.ldapClient.add(profileDN, ldapAttrs);
    return { dn: profileDN, name, description, attributes };
  },

  updateFreeradiusProfile: async (_parent: unknown, args: { dn: string; input: any }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const changes = Object.entries(args.input).map(([key, value]) => ({
      attribute: key,
      values: Array.isArray(value) ? value : [String(value)],
      operation: 'replace' as const,
    }));
    await context.ldapClient.modify(args.dn, changes);
    return { dn: args.dn, ...args.input };
  },

  deleteFreeradiusProfile: async (_parent: unknown, args: { dn: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    await context.ldapClient.delete(args.dn);
    return true;
  },

  createFreeradiusNas: async (_parent: unknown, args: { input: any }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const { nasname, shortname, type, secret, description, radiusclientid } = args.input;
    const baseDN = getBaseDN();
    const nasDN = `nasName=${nasname},ou=nas,${baseDN}`;

    const ldapAttrs: Record<string, string | string[]> = {
      objectClass: ['radiusNAS', 'top'],
      nasName: nasname,
    };
    if (shortname) ldapAttrs.shortName = shortname;
    if (type) ldapAttrs.nasType = type;
    if (secret) ldapAttrs.secret = secret;
    if (description) ldapAttrs.description = description;
    if (radiusclientid) ldapAttrs.radiusClientId = radiusclientid;

    await context.ldapClient.add(nasDN, ldapAttrs);
    return { dn: nasDN, nasname, shortname, type, secret, description, radiusclientid };
  },

  updateFreeradiusNas: async (_parent: unknown, args: { nasname: string; input: any }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const changes = Object.entries(args.input).map(([key, value]) => ({
      attribute: key,
      values: Array.isArray(value) ? value : [String(value)],
      operation: 'replace' as const,
    }));
    await context.ldapClient.modify(`nasName=${args.nasname},ou=nas,${getBaseDN()}`, changes);
    return { nasname: args.nasname, ...args.input };
  },

  deleteFreeradiusNas: async (_parent: unknown, args: { nasname: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    await context.ldapClient.delete(`nasName=${args.nasname},ou=nas,${getBaseDN()}`);
    return true;
  },

  createFreeradiusAttribute: async (_parent: unknown, args: { input: any }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const { username, attribute, operator, value } = args.input;
    const baseDN = getBaseDN();
    const attrDN = `cn=${username},ou=attributes,${baseDN}`;

    const ldapAttrs: Record<string, string | string[]> = {
      objectClass: ['radiusAttribute', 'top'],
      cn: username,
      radiusAttrName: attribute,
      radiusOperator: operator,
      radiusValue: value,
    };

    await context.ldapClient.add(attrDN, ldapAttrs);
    return { dn: attrDN, username, attribute, operator, value };
  },

  updateFreeradiusAttribute: async (_parent: unknown, args: { dn: string; input: any }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const changes = Object.entries(args.input).map(([key, value]) => ({
      attribute: key,
      values: Array.isArray(value) ? value : [String(value)],
      operation: 'replace' as const,
    }));
    await context.ldapClient.modify(args.dn, changes);
    return { dn: args.dn, ...args.input };
  },

  deleteFreeradiusAttribute: async (_parent: unknown, args: { dn: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    await context.ldapClient.delete(args.dn);
    return true;
  },
};

export const resolvers = {};
