// OpenLDAP GraphQL schema, queries, mutations, and resolvers

export const typeDefs = `
  # OpenLDAP Types
  type OpenLdapUser {
    dn: String!
    cn: String!
    uid: String
    mail: String
    userPassword: String
    objectClass: [String]!
    givenName: String
    sn: String
    telephoneNumber: String
    title: String
    ou: String
  }

  type OpenLdapGroup {
    dn: String!
    cn: String!
    gidNumber: Int
    memberUid: [String]
    member: [String]
    objectClass: [String]!
    description: String
  }

  type OpenLdapOu {
    dn: String!
    ou: String!
    description: String
    objectClass: [String]!
  }

  # Common entry for generic LDAP entries
  type LdapEntry {
    dn: String!
    attributes: JSON!
  }

  scalar JSON

  extend type Query {
    # Users
    openLdapUsers(baseDN: String, filter: String): [OpenLdapUser]!
    openLdapUser(dn: String!): OpenLdapUser

    # Groups
    openLdapGroups(baseDN: String, filter: String): [OpenLdapGroup]!
    openLdapGroup(dn: String!): OpenLdapGroup

    # OUs
    openLdapOus(baseDN: String, filter: String): [OpenLdapOu]!
    openLdapOu(dn: String!): OpenLdapOu

    # Generic entries
    ldapEntries(baseDN: String!, filter: String, scope: String, attributes: [String]): [LdapEntry]!
  }

  extend type Mutation {
    # User operations
    createOpenLdapUser(input: CreateUserInput!): OpenLdapUser!
    updateOpenLdapUser(dn: String!, input: UpdateUserInput!): OpenLdapUser!
    deleteOpenLdapUser(dn: String!): Boolean!

    # Group operations
    createOpenLdapGroup(input: CreateGroupInput!): OpenLdapGroup!
    updateOpenLdapGroup(dn: String!, input: UpdateGroupInput!): OpenLdapGroup!
    deleteOpenLdapGroup(dn: String!): Boolean!

    # OU operations
    createOpenLdapOu(input: CreateOuInput!): OpenLdapOu!
    updateOpenLdapOu(dn: String!, input: UpdateOuInput!): OpenLdapOu!
    deleteOpenLdapOu(dn: String!): Boolean!

    # Generic entry operations
    createLdapEntry(dn: String!, attributes: JSON!): LdapEntry!
    updateLdapEntry(dn: String!, changes: [LdapChangeInput!]!): LdapEntry!
    deleteLdapEntry(dn: String!): Boolean!
  }

  input CreateUserInput {
    cn: String!
    uid: String
    mail: String
    userPassword: String
    givenName: String
    sn: String
    telephoneNumber: String
    title: String
    ou: String
  }

  input UpdateUserInput {
    cn: String
    uid: String
    mail: String
    userPassword: String
    givenName: String
    sn: String
    telephoneNumber: String
    title: String
    ou: String
  }

  input CreateGroupInput {
    cn: String!
    gidNumber: Int
    memberUid: [String]
    description: String
  }

  input UpdateGroupInput {
    cn: String
    gidNumber: Int
    memberUid: [String]
    description: String
  }

  input CreateOuInput {
    ou: String!
    description: String
  }

  input UpdateOuInput {
    ou: String
    description: String
  }

  input LdapChangeInput {
    attribute: String!
    values: [JSON]!
    operation: String! # add, replace, delete
  }
`;

// Query resolvers - these will be connected at runtime via context

const getBaseDN = () => {
  const baseDN = process.env.LDAP_BASE_DN || 'dc=netcrave,dc=local';
  return baseDN;
};

export const queries = {
  // Users
  openLdapUsers: async (_parent: unknown, args: { baseDN?: string; filter?: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const baseDN = args.baseDN || getBaseDN();
    const filter = args.filter || '(objectClass=posixAccount)';
    return await context.ldapClient.search({ baseDN, filter, scope: 'subtree', attributes: ['cn', 'uid', 'mail', 'givenName', 'sn', 'telephoneNumber', 'title', 'ou'] });
  },

  openLdapUser: async (_parent: unknown, args: { dn: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const baseDN = process.env.LDAP_BASE_DN || 'dc=netcrave,dc=local';
    const filter = `(dn=${args.dn})`;
    const results = await context.ldapClient.search({ baseDN: args.dn, filter, scope: 'base', attributes: ['*'] });
    return results.length > 0 ? results[0] : null;
  },

  // Groups
  openLdapGroups: async (_parent: unknown, args: { baseDN?: string; filter?: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const baseDN = args.baseDN || getBaseDN();
    const filter = args.filter || '(objectClass=posixGroup)';
    return await context.ldapClient.search({ baseDN, filter, scope: 'subtree', attributes: ['cn', 'gidNumber', 'memberUid', 'description'] });
  },

  openLdapGroup: async (_parent: unknown, args: { dn: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const filter = `(dn=${args.dn})`;
    const results = await context.ldapClient.search({ baseDN: args.dn, filter, scope: 'base', attributes: ['*'] });
    return results.length > 0 ? results[0] : null;
  },

  // OUs
  openLdapOus: async (_parent: unknown, args: { baseDN?: string; filter?: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const baseDN = args.baseDN || getBaseDN();
    const filter = args.filter || '(objectClass=organizationalUnit)';
    return await context.ldapClient.search({ baseDN, filter, scope: 'subtree', attributes: ['ou', 'description'] });
  },

  openLdapOu: async (_parent: unknown, args: { dn: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const filter = `(dn=${args.dn})`;
    const results = await context.ldapClient.search({ baseDN: args.dn, filter, scope: 'base', attributes: ['*'] });
    return results.length > 0 ? results[0] : null;
  },

  // Generic entries
  ldapEntries: async (_parent: unknown, args: { baseDN: string; filter?: string; scope?: string; attributes?: string[] }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const baseDN = args.baseDN;
    const filter = args.filter || '(objectClass=*)';
    const scope = (args.scope as any) || 'subtree';
    return await context.ldapClient.search({ baseDN, filter, scope, attributes: args.attributes });
  },
};

// Mutation resolvers use the same getBaseDN() function

export const mutations = {
  createOpenLdapUser: async (_parent: unknown, args: { input: any }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');

    const { cn, uid, mail, userPassword, givenName, sn, telephoneNumber, title, ou } = args.input;

    // Generate UID/GID if not provided
    const baseDN = getBaseDN();
    const userDN = `uid=${uid || cn},${ou ? `ou=${ou},` : ''}cn=users,${baseDN}`;

    const attributes: Record<string, string | string[]> = {
      objectClass: ['person', 'organizationalPerson', 'inetOrgPerson', 'posixAccount'],
      cn: cn,
      uid: uid || cn.toLowerCase(),
    };

    if (mail) attributes.mail = mail;
    if (givenName) attributes.givenName = givenName;
    if (sn) attributes.sn = sn;
    if (telephoneNumber) attributes.telephoneNumber = telephoneNumber;
    if (title) attributes.title = title;
    if (ou) attributes.ou = ou;

    // Add userPassword if provided
    if (userPassword) {
      attributes.userPassword = '{SSHA}' + Buffer.from(userPassword).toString('base64');
    }

    await context.ldapClient.add(userDN, attributes);

    return { dn: userDN, ...attributes };
  },

  updateOpenLdapUser: async (_parent: unknown, args: { dn: string; input: any }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');

    const changes = Object.entries(args.input).map(([key, value]) => ({
      attribute: key,
      values: Array.isArray(value) ? value : [String(value)],
      operation: 'replace' as const,
    }));

    await context.ldapClient.modify(args.dn, changes);

    return { dn: args.dn, ...args.input };
  },

  deleteOpenLdapUser: async (_parent: unknown, args: { dn: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    await context.ldapClient.delete(args.dn);
    return true;
  },

  createOpenLdapGroup: async (_parent: unknown, args: { input: any }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');

    const { cn, gidNumber, memberUid, description } = args.input;

    const baseDN = getBaseDN();
    const groupDN = `cn=${cn},${baseDN}`;

    const attributes: Record<string, string | string[]> = {
      objectClass: ['posixGroup'],
      cn: cn,
    };

    if (gidNumber) attributes.gidNumber = String(gidNumber);
    if (memberUid) attributes.memberUid = Array.isArray(memberUid) ? memberUid : [String(memberUid)];
    if (description) attributes.description = description;

    await context.ldapClient.add(groupDN, attributes);

    return { dn: groupDN, ...attributes };
  },

  updateOpenLdapGroup: async (_parent: unknown, args: { dn: string; input: any }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');

    const changes = Object.entries(args.input).map(([key, value]) => ({
      attribute: key,
      values: Array.isArray(value) ? value : [String(value)],
      operation: 'replace' as const,
    }));

    await context.ldapClient.modify(args.dn, changes);

    return { dn: args.dn, ...args.input };
  },

  deleteOpenLdapGroup: async (_parent: unknown, args: { dn: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    await context.ldapClient.delete(args.dn);
    return true;
  },

  createOpenLdapOu: async (_parent: unknown, args: { input: any }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');

    const { ou, description } = args.input;

    const baseDN = getBaseDN();
    const ouDN = `ou=${ou},${baseDN}`;

    await context.ldapClient.add(ouDN, {
      objectClass: ['organizationalUnit'],
      ou: ou,
      ...(description ? { description } : {}),
    });

    return { dn: ouDN, ou, description };
  },

  updateOpenLdapOu: async (_parent: unknown, args: { dn: string; input: any }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');

    const changes = Object.entries(args.input).map(([key, value]) => ({
      attribute: key,
      values: Array.isArray(value) ? value : [String(value)],
      operation: 'replace' as const,
    }));

    await context.ldapClient.modify(args.dn, changes);

    return { dn: args.dn, ...args.input };
  },

  deleteOpenLdapOu: async (_parent: unknown, args: { dn: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    await context.ldapClient.delete(args.dn);
    return true;
  },

  createLdapEntry: async (_parent: unknown, args: { dn: string; attributes: Record<string, unknown> }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');

    const formattedAttrs: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(args.attributes)) {
      if (Array.isArray(value)) {
        formattedAttrs[key] = value.map((v) => String(v));
      } else if (value !== undefined && value !== null) {
        formattedAttrs[key] = String(value);
      }
    }

    await context.ldapClient.add(args.dn, formattedAttrs);
    return { dn: args.dn, attributes: args.attributes };
  },

  updateLdapEntry: async (_parent: unknown, args: { dn: string; changes: any[] }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');

    const ldapChanges = args.changes.map((change: any) => ({
      operation: change.operation,
      modification: { [change.attribute]: change.values as string[] },
    }));

    await context.ldapClient.modify(args.dn, ldapChanges);
    return { dn: args.dn, changes: args.changes };
  },

  deleteLdapEntry: async (_parent: unknown, args: { dn: string }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    await context.ldapClient.delete(args.dn);
    return true;
  },
};

// JSON scalar resolver
const jsonScalar = {
  name: 'JSON',
  parseValue(value: unknown) {
    return value;
  },
  serialize(value: unknown) {
    return value;
  },
  parseLiteral(ast: any) {
    if (ast.kind === 'Object') {
      const obj: Record<string, unknown> = {};
      ast.fields.forEach((field: any) => {
        obj[field.name.value] = field.value;
      });
      return obj;
    }
    return null;
  },
};

// Resolvers object
export const resolvers = {
  JSON: jsonScalar,
  Query: queries,
  Mutation: mutations,
};
