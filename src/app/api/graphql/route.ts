import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from '@/lib/graphql';
import { ldapClientPool, LdapConfig } from '@/lib/ldap/client';

// Get LDAP configuration from environment
const getLdapConfig = (): LdapConfig => ({
  url: process.env.LDAP_URL || 'ldaps://localhost',
  bindDN: process.env.LDAP_BIND_DN || '',
  bindPassword: process.env.LDAP_BIND_PASSWORD || '',
  tlsRejectUnauthorized: process.env.LDAP_TLS_REJECT_UNAUTHORIZED !== 'false',
});

export async function POST(request: Request) {
  const req = await request.json();
  const { query, variables, operationName } = req;

  // Create LDAP client for this request
  const ldapConfig = getLdapConfig();
  const ldapClient = ldapClientPool.getClient(ldapConfig);

  // Create context with LDAP client
  const context = {
    ldapClient,
  };

  // Create Apollo Server with resolvers that need context
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  try {
    const result = await server.executeOperation(
      { query, variables, operationName },
      { context }
    );

    return Response.json(result);
  } catch (error) {
    console.error('GraphQL error:', error);
    return Response.json(
      { errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }] },
      { status: 400 }
    );
  }
}
