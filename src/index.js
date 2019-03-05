import {ApolloServer} from 'apollo-server';
import {resolvers, typeDefs} from './schema';
import {sequelize} from './db';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
});

sequelize.sync().then(async () => {
  const {url} = await server.listen(process.env.PORT);
  console.log(`🚀 Server ready at ${url}`);
});
