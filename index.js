import {ApolloServer, gql} from 'apollo-server';

const typeDefs = gql`
  type Query {
    foo: String
  }
`;

const resolvers = {
  Query: {
    foo: () => 'bar'
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen(process.env.PORT).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});
