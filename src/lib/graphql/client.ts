// GraphQL client for making API calls

interface GraphqlRequestOptions {
  query: string;
  variables?: Record<string, unknown>;
}

export async function graphqlRequest<T = any>(options: GraphqlRequestOptions): Promise<T> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: options.query,
      variables: options.variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors && data.errors.length > 0) {
    throw new Error(data.errors[0].message);
  }

  return data.data;
}

// Re-export OpenLDAP queries and mutations
export * from './openldap';

// Re-export FreeRADIUS queries and mutations
export * from './freeradius';

// Re-export Asterisk queries and mutations
export * from './asterisk';

// Re-export Kerberos queries and mutations
export * from './krb5';

// Re-export Netcrave queries and mutations
export * from './netcrave';

// Re-export OpenDKIM queries and mutations
export * from './opendkim';

// Re-export Sendmail queries and mutations
export * from './sendmail';

// Re-export PowerDNS queries and mutations
export * from './powerdns';
