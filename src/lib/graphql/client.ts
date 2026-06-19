// GraphQL client for making API calls

interface GraphqlRequestOptions {
  query: string;
  variables?: Record<string, unknown>;
}

export async function graphqlRequest<T = any>(
  options: GraphqlRequestOptions,
): Promise<T> {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: options.query,
      variables: options.variables,
    }),
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    // If response isn't valid JSON, use status text as error
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  // Extract errors from the actual Apollo response format used by Next.js App Router
  // Response structure is: { http: {...}, body: { kind: 'single', singleResult: { errors: [...], data } } }
  const body = (data as any).body || data;
  const singleResult = (body as any).singleResult || (body as any);
  const errors = singleResult.errors || ((body as any).errors as any[]);

  // Check for GraphQL errors in the response body
  if (errors && errors.length > 0) {
    const error = errors[0];
    const message = error.message;
    const httpStatus = (data as any).http?.status || response.status;

    // Combine all error information
    let detailedMessage = `HTTP ${httpStatus}: ${message}`;
    if (error.extensions?.code) {
      detailedMessage += `. Code: ${error.extensions.code}`;
    }
    throw new Error(detailedMessage);
  }

  // If no errors but response wasn't OK, use status text
  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  // Extract data from the same structure
  return (body as any).data || singleResult.data;
}
