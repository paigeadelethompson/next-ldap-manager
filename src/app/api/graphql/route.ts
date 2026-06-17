import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from '@/lib/graphql';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export async function POST(request: Request) {
  const req = await request.json();
  const { query, variables, operationName } = req;

  const result = await server.executeOperation(
    { query, variables, operationName }
  );

  return Response.json(result);
}
