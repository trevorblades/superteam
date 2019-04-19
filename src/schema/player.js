import {Player, Statistic} from '../db';
import {gql} from 'apollo-server-express';

export const typeDef = gql`
  extend type Query {
    player(id: ID!): Player
    players: [Player]
  }

  extend type Team {
    players: [Player]
  }

  extend type Selection {
    player: Player
  }

  type Player {
    id: ID
    name: String
    ign: String
    country: String
    image: String
  }
`;

export const resolvers = {
  Query: {
    player(parent, args) {
      return Player.findByPk(args.id);
    },
    players() {
      return Player.findAll({
        include: [
          {
            model: Statistic,
            attributes: []
          }
        ],
        order: [
          // this orders the player by percentile rank
          [Statistic, 'year', 'desc'],
          [Statistic, 'week', 'desc'],
          [Statistic, 'percentile', 'desc']
        ]
      });
    }
  },
  Selection: {
    player(parent) {
      return parent.getPlayer();
    }
  },
  Team: {
    players(parent) {
      return parent.getPlayers();
    }
  }
};
