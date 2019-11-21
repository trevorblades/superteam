import merge from 'lodash/merge';
import {typeDef as Entry, resolvers as entryResolvers} from './entry';
import {typeDef as Player, resolvers as playerResolvers} from './player';
import {
  typeDef as Selection,
  resolvers as selectionResolvers
} from './selection';
import {
  typeDef as Statistic,
  resolvers as statisticResolvers
} from './statistic';
import {typeDef as Team, resolvers as teamResolvers} from './team';
import {typeDef as User} from './user';
import {gql, makeExecutableSchema} from 'apollo-server-express';

const Query = gql`
  type Query {
    _empty: String
  }
`;

const Mutation = gql`
  type Mutation {
    _empty: String
  }
`;

export default makeExecutableSchema({
  typeDefs: [Query, Mutation, Entry, Player, Selection, Statistic, Team, User],
  resolvers: merge(
    entryResolvers,
    playerResolvers,
    selectionResolvers,
    statisticResolvers,
    teamResolvers
  )
});
