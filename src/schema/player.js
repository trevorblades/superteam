import {Player, Statistic} from '../db';
import {gql} from 'apollo-server-express';

export const typeDef = gql`
  extend type Query {
    player(id: ID!): Player
    players: [Player]
  }

  type Player {
    id: ID
    name: String
    ign: String
    country: String
    image: String
    team: Team
    statistics: [Statistic]
  }
`;

export const resolvers = {
  Query: {
    player: (parent, args) => Player.findByPk(args.id),
    players: () =>
      Player.findAll({
        include: [
          {
            model: Statistic,
            attributes: []
          }
        ],
        order: [
          [Statistic, 'year', 'desc'],
          [Statistic, 'week', 'desc'],
          [Statistic, 'percentile', 'desc']
        ]
      })
  },
  Player: {
    team: parent => parent.getTeam(),
    statistics: parent =>
      parent.getStatistics({
        order: [['year', 'desc'], ['week', 'desc']]
      })
  }
};
