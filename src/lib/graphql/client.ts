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
