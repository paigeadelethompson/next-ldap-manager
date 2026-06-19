import { ApolloServer } from "@apollo/server";
import { typeDefs, resolvers } from "@/lib/graphql";
import { ldapClientPool, LdapConfig } from "@/lib/ldap/client";

// Get LDAP configuration from environment
const getLdapConfig = (): LdapConfig => ({
  url: process.env.LDAP_URL || "ldaps://localhost",
  bindDN: process.env.LDAP_BIND_DN || "",
  bindPassword: process.env.LDAP_BIND_PASSWORD || "",
  tlsRejectUnauthorized: process.env.LDAP_TLS_REJECT_UNAUTHORIZED !== "false",
});

export async function POST(request: Request) {
  const req = await request.json();
  const { query, variables, operationName } = req;

  // Create LDAP client for this request
  const ldapConfig = getLdapConfig();

  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const contextValue = { ldapClient: ldapClientPool.getClient(ldapConfig) };

    const result = await server.executeOperation(
      { query, variables, operationName },
      { contextValue },
    );

    // Check if response contains GraphQL errors (in singleResult format used by Next.js)
    const body = (result as any).body || (result as any);
    const errors = body.singleResult?.errors || body.errors || [];

    if (errors.length > 0) {
      console.error("GraphQL error:", errors[0].message);
      // For Apollo Server's single result format, we need to return the full response structure
      // but with a 500 status code
      const statusCode = (body as any).http?.status || 500;
      return new Response(JSON.stringify(result), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GraphQL error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        errors: [{ message: errorMessage }],
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
