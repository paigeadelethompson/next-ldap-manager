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
    uidNumber: Int
    gidNumber: Int
    homeDirectory: String
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
`;

// OpenLDAP GraphQL queries and mutations for client-side use

export const CREATE_USER_MUTATION = `
  mutation CreateOpenLdapUser($input: CreateUserInput!) {
    createOpenLdapUser(input: $input) {
      dn
      cn
      uid
      mail
      givenName
      sn
      telephoneNumber
      title
      ou
    }
  }
`;

export const UPDATE_USER_MUTATION = `
  mutation UpdateOpenLdapUser($dn: String!, $input: UpdateUserInput!) {
    updateOpenLdapUser(dn: $dn, input: $input) {
      dn
      cn
      uid
      mail
      givenName
      sn
      telephoneNumber
      title
      ou
    }
  }
`;

export const DELETE_USER_MUTATION = `
  mutation DeleteOpenLdapUser($dn: String!) {
    deleteOpenLdapUser(dn: $dn)
  }
`;

export const CREATE_GROUP_MUTATION = `
  mutation CreateOpenLdapGroup($input: CreateGroupInput!) {
    createOpenLdapGroup(input: $input) {
      dn
      cn
      gidNumber
      memberUid
      description
    }
  }
`;

export const UPDATE_GROUP_MUTATION = `
  mutation UpdateOpenLdapGroup($dn: String!, $input: UpdateGroupInput!) {
    updateOpenLdapGroup(dn: $dn, input: $input) {
      dn
      cn
      gidNumber
      memberUid
      description
    }
  }
`;

export const DELETE_GROUP_MUTATION = `
  mutation DeleteOpenLdapGroup($dn: String!) {
    deleteOpenLdapGroup(dn: $dn)
  }
`;

export const CREATE_OU_MUTATION = `
  mutation CreateOpenLdapOu($input: CreateOuInput!) {
    createOpenLdapOu(input: $input) {
      dn
      ou
      description
    }
  }
`;

export const UPDATE_OU_MUTATION = `
  mutation UpdateOpenLdapOu($dn: String!, $input: UpdateOuInput!) {
    updateOpenLdapOu(dn: $dn, input: $input) {
      dn
      ou
      description
    }
  }
`;

export const DELETE_OU_MUTATION = `
  mutation DeleteOpenLdapOu($dn: String!) {
    deleteOpenLdapOu(dn: $dn)
  }
`;

export const FETCH_USERS_QUERY = `
  query OpenLdapUsers($baseDN: String, $filter: String) {
    openLdapUsers(baseDN: $baseDN, filter: $filter) {
      dn
      cn
      uid
      mail
      givenName
      sn
      telephoneNumber
      title
      ou
    }
  }
`;

export const FETCH_GROUPS_QUERY = `
  query OpenLdapGroups($baseDN: String, $filter: String) {
    openLdapGroups(baseDN: $baseDN, filter: $filter) {
      dn
      cn
      gidNumber
      memberUid
      description
    }
  }
`;

export const FETCH_OUS_QUERY = `
  query OpenLdapOus($baseDN: String, $filter: String) {
    openLdapOus(baseDN: $baseDN, filter: $filter) {
      dn
      ou
      description
    }
  }
`;

export const FETCH_USER_QUERY = `
  query OpenLdapUser($dn: String!) {
    openLdapUser(dn: $dn) {
      dn
      cn
      uid
      mail
      givenName
      sn
      telephoneNumber
      title
      ou
    }
  }
`;

export const FETCH_GROUP_QUERY = `
  query OpenLdapGroup($dn: String!) {
    openLdapGroup(dn: $dn) {
      dn
      cn
      gidNumber
      memberUid
      description
    }
  }
`;

export const FETCH_OU_QUERY = `
  query OpenLdapOu($dn: String!) {
    openLdapOu(dn: $dn) {
      dn
      ou
      description
    }
  }
`;

// Helper to safely get a single value from LDAP attribute
function getLdapAttrValue(attr: any): string | undefined {
  if (attr === undefined || attr === null) return undefined;
  if (Array.isArray(attr)) {
    return attr.length > 0 ? (attr[0] as string) : undefined;
  }
  return attr as string;
}

// Helper to transform LDAP entries to flat objects matching GraphQL type
function ldapEntryToOpenLdapUser(entry: any): any {
  // cn is non-nullable in schema, so we must ensure it has a value
  const cn = getLdapAttrValue(
    Array.isArray(entry.attributes.cn)
      ? entry.attributes.cn[0]
      : entry.attributes.cn,
  );

  return {
    dn: entry.dn,
    cn: cn || "",
    uid: Array.isArray(entry.attributes.uid)
      ? entry.attributes.uid[0]
      : (entry.attributes.uid ?? null),
    mail: Array.isArray(entry.attributes.mail)
      ? entry.attributes.mail[0]
      : (entry.attributes.mail ?? null),
    userPassword: Array.isArray(entry.attributes.userPassword)
      ? entry.attributes.userPassword[0]
      : (entry.attributes.userPassword ?? null),
    objectClass: Array.isArray(entry.attributes.objectClass)
      ? entry.attributes.objectClass
      : entry.attributes.objectClass
        ? [entry.attributes.objectClass]
        : [],
    givenName: Array.isArray(entry.attributes.givenName)
      ? entry.attributes.givenName[0]
      : (entry.attributes.givenName ?? null),
    sn: Array.isArray(entry.attributes.sn)
      ? entry.attributes.sn[0]
      : (entry.attributes.sn ?? null),
    telephoneNumber: Array.isArray(entry.attributes.telephoneNumber)
      ? entry.attributes.telephoneNumber[0]
      : (entry.attributes.telephoneNumber ?? null),
    title: Array.isArray(entry.attributes.title)
      ? entry.attributes.title[0]
      : (entry.attributes.title ?? null),
    ou: Array.isArray(entry.attributes.ou)
      ? entry.attributes.ou[0]
      : (entry.attributes.ou ?? null),
  };
}

function ldapEntryToOpenLdapGroup(entry: any): any {
  return {
    dn: entry.dn,
    cn: Array.isArray(entry.attributes.cn)
      ? entry.attributes.cn[0]
      : (entry.attributes.cn ?? null),
    gidNumber:
      entry.attributes.gidNumber != null
        ? Array.isArray(entry.attributes.gidNumber)
          ? parseInt(entry.attributes.gidNumber[0], 10)
          : parseInt(entry.attributes.gidNumber, 10)
        : null,
    memberUid: Array.isArray(entry.attributes.memberUid)
      ? entry.attributes.memberUid
      : [],
    member: Array.isArray(entry.attributes.member)
      ? entry.attributes.member
      : [],
    objectClass: entry.attributes.objectClass ?? [],
    description: Array.isArray(entry.attributes.description)
      ? entry.attributes.description[0]
      : (entry.attributes.description ?? null),
  };
}

function ldapEntryToOpenLdapOu(entry: any): any {
  return {
    dn: entry.dn,
    ou: Array.isArray(entry.attributes.ou)
      ? entry.attributes.ou[0]
      : (entry.attributes.ou ?? null),
    description: Array.isArray(entry.attributes.description)
      ? entry.attributes.description[0]
      : (entry.attributes.description ?? null),
    objectClass: entry.attributes.objectClass ?? [],
  };
}

// OpenLDAP query resolvers
export const queries = {
  // Users
  openLdapUsers: async (
    _parent: unknown,
    args: { baseDN?: string; filter?: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const baseDN = args.baseDN || "dc=netcrave,dc=local";
    const filter = args.filter || "(objectClass=posixAccount)";
    try {
      const results = await context.ldapClient.search({
        baseDN,
        filter,
        scope: "subtree",
        attributes: [
          "cn",
          "uid",
          "mail",
          "givenName",
          "sn",
          "telephoneNumber",
          "title",
          "ou",
        ],
      });
      // Ensure we always return an array (even if empty), filtering out null entries
      const users = Array.isArray(results) ? results.filter(Boolean) : [];
      return users
        .map(ldapEntryToOpenLdapUser)
        .filter((u: any) => u && u.cn !== undefined);
    } catch {
      // Return empty array on error to satisfy non-nullable constraint
      return [];
    }
  },

  openLdapUser: async (
    _parent: unknown,
    args: { dn: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const filter = `(dn=${args.dn})`;
    const baseDN = process.env.LDAP_BASE_DN || "dc=netcrave,dc=local";
    // Extract the parent DN from the user's DN for search
    const parts = args.dn.split(",");
    if (parts.length > 1) {
      parts.shift(); // Remove the first RDN (e.g., uid=jdoe)
    }
    const searchBase = parts.join(",");
    const results = await context.ldapClient.search({
      baseDN: searchBase || baseDN,
      filter,
      scope: "subtree",
      attributes: ["*"],
    });
    return results.length > 0 ? ldapEntryToOpenLdapUser(results[0]) : null;
  },

  // Groups
  openLdapGroups: async (
    _parent: unknown,
    args: { baseDN?: string; filter?: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const baseDN = args.baseDN || "dc=netcrave,dc=local";
    const filter = args.filter || "(objectClass=posixGroup)";
    const results = await context.ldapClient.search({
      baseDN,
      filter,
      scope: "subtree",
      attributes: ["cn", "gidNumber", "memberUid", "description"],
    });
    return results.map(ldapEntryToOpenLdapGroup);
  },

  openLdapGroup: async (
    _parent: unknown,
    args: { dn: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const filter = `(dn=${args.dn})`;
    const baseDN = process.env.LDAP_BASE_DN || "dc=netcrave,dc=local";
    // Extract the parent DN from the group's DN for search
    const parts = args.dn.split(",");
    if (parts.length > 1) {
      parts.shift(); // Remove the first RDN (e.g., cn=developers)
    }
    const searchBase = parts.join(",");
    const results = await context.ldapClient.search({
      baseDN: searchBase || baseDN,
      filter,
      scope: "subtree",
      attributes: ["*"],
    });
    return results.length > 0 ? ldapEntryToOpenLdapGroup(results[0]) : null;
  },

  // OUs
  openLdapOus: async (
    _parent: unknown,
    args: { baseDN?: string; filter?: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const baseDN = args.baseDN || "dc=netcrave,dc=local";
    const filter = args.filter || "(objectClass=organizationalUnit)";
    const results = await context.ldapClient.search({
      baseDN,
      filter,
      scope: "subtree",
      attributes: ["ou", "description"],
    });
    return results.map(ldapEntryToOpenLdapOu);
  },

  openLdapOu: async (_parent: unknown, args: { dn: string }, context: any) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    const filter = `(dn=${args.dn})`;
    const baseDN = process.env.LDAP_BASE_DN || "dc=netcrave,dc=local";
    // Extract the parent DN from the OU's DN for search
    const parts = args.dn.split(",");
    if (parts.length > 1) {
      parts.shift(); // Remove the first RDN (e.g., ou=Engineering)
    }
    const searchBase = parts.join(",");
    const results = await context.ldapClient.search({
      baseDN: searchBase || baseDN,
      filter,
      scope: "subtree",
      attributes: ["*"],
    });
    return results.length > 0 ? ldapEntryToOpenLdapOu(results[0]) : null;
  },
};

// OpenLDAP mutation resolvers
export const mutations = {
  createOpenLdapUser: async (
    _parent: unknown,
    args: { input: any },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");

    const {
      cn,
      uid,
      mail,
      userPassword,
      givenName,
      sn,
      telephoneNumber,
      title,
      ou,
      uidNumber,
      gidNumber,
      homeDirectory,
    } = args.input;

    // Generate UID/GID numbers automatically when using posixAccount
    const baseDN = process.env.LDAP_BASE_DN || "dc=netcrave,dc=local";

    // Ensure ou=numbers container exists for UID/GID auto-generation
    try {
      await ensureContainerExists(context.ldapClient, baseDN, "ou", "numbers");
    } catch (e) {
      console.warn("Could not create ou=numbers container:", e);
    }

    // Get next available UID number if not provided
    let autoUidNumber = uidNumber;
    if (autoUidNumber === undefined) {
      try {
        const nextUidResult = await context.ldapClient.searchOne({
          baseDN: `ou=numbers,${baseDN}`,
          filter: "(objectClass=uidNumber)",
          scope: "subtree",
        });
        autoUidNumber = nextUidResult
          ? parseInt(nextUidResult.attributes.uidNumber?.[0] || "1000", 10) + 1
          : 1000;
      } catch {
        // Fallback to default if search fails
        autoUidNumber = 1000;
      }
    }

    // Ensure the parent containers exist (ou=users)
    try {
      await ensureContainerExists(context.ldapClient, baseDN, "ou", "users");
    } catch (e: any) {
      console.error("Failed to create ou=users:", e.message);
    }

    const userDN = `uid=${uid || cn},ou=users,${baseDN}`;

    const attributes: Record<string, string | string[]> = {
      objectClass: [
        "person",
        "organizationalPerson",
        "inetOrgPerson",
        "posixAccount",
      ],
      cn: cn,
      uid: uid || cn.toLowerCase(),
    };

    if (mail) attributes.mail = mail;
    if (givenName) attributes.givenName = givenName;
    if (sn) attributes.sn = sn;
    if (telephoneNumber) attributes.telephoneNumber = telephoneNumber;
    if (title) attributes.title = title;
    if (ou) attributes.ou = ou;
    if (autoUidNumber != null && autoUidNumber !== "")
      attributes.uidNumber = String(autoUidNumber);
    if (gidNumber != null && gidNumber !== "")
      attributes.gidNumber = String(gidNumber);
    if (homeDirectory && homeDirectory !== "")
      attributes.homeDirectory = homeDirectory;

    // Add userPassword if provided
    if (userPassword) {
      attributes.userPassword =
        "{SSHA}" + Buffer.from(userPassword).toString("base64");
    }

    await context.ldapClient.add(userDN, attributes);

    return {
      dn: userDN,
      cn,
      uid: uid || cn.toLowerCase(),
      mail: mail || null,
      givenName: givenName || null,
      sn: sn || null,
      telephoneNumber: telephoneNumber || null,
      title: title || null,
      ou: ou || null,
      uidNumber: autoUidNumber || null,
      gidNumber: gidNumber || null,
      homeDirectory: homeDirectory || null,
    };
  },

  updateOpenLdapUser: async (
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

  deleteOpenLdapUser: async (
    _parent: unknown,
    args: { dn: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    await context.ldapClient.delete(args.dn);
    return true;
  },

  createOpenLdapGroup: async (
    _parent: unknown,
    args: { input: any },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");

    const { cn, gidNumber, memberUid, description } = args.input;

    const baseDN = process.env.LDAP_BASE_DN || "dc=netcrave,dc=local";
    const groupDN = `cn=${cn},${baseDN}`;

    const attributes: Record<string, string | string[]> = {
      objectClass: ["posixGroup"],
      cn: cn,
    };

    if (gidNumber) attributes.gidNumber = String(gidNumber);
    if (memberUid)
      attributes.memberUid = Array.isArray(memberUid)
        ? memberUid
        : [String(memberUid)];
    if (description) attributes.description = description;

    await context.ldapClient.add(groupDN, attributes);

    return { dn: groupDN, ...attributes };
  },

  updateOpenLdapGroup: async (
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

  deleteOpenLdapGroup: async (
    _parent: unknown,
    args: { dn: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    await context.ldapClient.delete(args.dn);
    return true;
  },

  createOpenLdapOu: async (
    _parent: unknown,
    args: { input: any },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");

    const { ou, description } = args.input;

    const baseDN = process.env.LDAP_BASE_DN || "dc=netcrave,dc=local";
    const ouDN = `ou=${ou},${baseDN}`;

    await context.ldapClient.add(ouDN, {
      objectClass: ["organizationalUnit"],
      ou: ou,
      ...(description ? { description } : {}),
    });

    return { dn: ouDN, ou, description };
  },

  updateOpenLdapOu: async (
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

  deleteOpenLdapOu: async (
    _parent: unknown,
    args: { dn: string },
    context: any,
  ) => {
    if (!context.ldapClient) throw new Error("LDAP client not available");
    await context.ldapClient.delete(args.dn);
    return true;
  },
};

// Helper function to ensure an organizational unit/container exists
async function ensureContainerExists(
  ldapClient: any,
  baseDN: string,
  rdnKey: string,
  rdnValue: string,
): Promise<void> {
  const containerDN = `${rdnKey}=${rdnValue},${baseDN}`;

  try {
    await ldapClient.add(containerDN, {
      objectClass: ["organizationalUnit", "top"],
      [rdnKey]: rdnValue,
    });
  } catch (error: any) {
    // Check if the error is because parent doesn't exist
    const errorMessage = error.message || "";
    if (
      errorMessage.includes("The target object cannot be found") ||
      errorMessage.includes("Code: 0x20")
    ) {
      // Parse parent DN and try to create it first
      const parts = containerDN.split(",");
      if (parts.length > 1) {
        parts.shift();
        const parentRDN = parts[0].split("=");
        if (parentRDN.length === 2) {
          await ensureContainerExists(
            ldapClient,
            baseDN,
            parentRDN[0],
            parentRDN[1],
          );
        }
      }
      // Try again after creating parent
      try {
        await ldapClient.add(containerDN, {
          objectClass: ["organizationalUnit", "top"],
          [rdnKey]: rdnValue,
        });
      } catch (createError: any) {
        // Silently fail - the container might already exist or there's a permission issue
      }
    }
  }
}
