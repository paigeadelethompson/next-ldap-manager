// Base GraphQL schema and resolvers for LDAP Manager
// Each service extends this with its own types, queries, and mutations

import { typeDefs as openldapTypeDefs } from './openldap';
import { typeDefs as asteriskTypeDefs } from './asterisk';
import { typeDefs as freeradiusTypeDefs } from './freeradius';
import { typeDefs as krb5TypeDefs } from './krb5';
import { typeDefs as netcraveTypeDefs } from './netcrave';
import { typeDefs as opendkimTypeDefs } from './opendkim';
import { typeDefs as powerdnsTypeDefs } from './powerdns';
import { typeDefs as sendmailTypeDefs } from './sendmail';

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
  scalar Date

  # Common types
  scalar JSON

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
};

export { typeDefs, resolvers };
