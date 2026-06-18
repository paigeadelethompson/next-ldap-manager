// Base GraphQL schema and resolvers for LDAP Manager
// Each service extends this with its own types, queries, and mutations

import { baseTypeDefs } from './types';
import { typeDefs as openldapTypeDefs } from './openldap';
import { typeDefs as asteriskTypeDefs } from './asterisk';
import { typeDefs as freeradiusTypeDefs } from './freeradius';
import { typeDefs as krb5TypeDefs } from './krb5';
import { typeDefs as netcraveTypeDefs } from './netcrave';
import { typeDefs as opendkimTypeDefs } from './opendkim';
import { typeDefs as powerdnsTypeDefs } from './powerdns';
import { typeDefs as sendmailTypeDefs } from './sendmail';

// Generic LDAP entry operations resolvers
const getBaseDN = () => {
  const baseDN = process.env.LDAP_BASE_DN || 'dc=netcrave,dc=local';
  return baseDN;
};

export const queries = {
  ldapEntries: async (_parent: unknown, args: { baseDN: string; filter?: string; scope?: string; attributes?: string[] }, context: any) => {
    if (!context.ldapClient) throw new Error('LDAP client not available');
    const baseDN = args.baseDN;
    const filter = args.filter || '(objectClass=*)';
    const scope = (args.scope as any) || 'subtree';
    return await context.ldapClient.search({ baseDN, filter, scope, attributes: args.attributes });
  },
};

export const mutations = {
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

// Date scalar resolver
const dateScalar = {
  name: 'Date',
  parseValue(value: unknown) {
    return value;
  },
  serialize(value: unknown) {
    return value;
  },
  parseLiteral(ast: any) {
    return ast.value;
  },
};

const typeDefs = `
  ${baseTypeDefs}

  ${openldapTypeDefs}
  ${asteriskTypeDefs}
  ${freeradiusTypeDefs}
  ${krb5TypeDefs}
  ${netcraveTypeDefs}
  ${opendkimTypeDefs}
  ${powerdnsTypeDefs}
  ${sendmailTypeDefs}
`;

const resolvers = {
  JSON: jsonScalar,
  Date: dateScalar,
  Query: queries,
  Mutation: mutations,
};

export { typeDefs, resolvers };
