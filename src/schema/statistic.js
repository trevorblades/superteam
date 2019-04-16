import {gql} from 'apollo-server-express';

export const typeDef = gql`
  extend type Player {
    statistics: [Statistic]
  }

  type Statistic {
    id: ID
    rating: Float
    percentile: Float
    kills: Int
    deaths: Int
    kdRatio: Float
    headshots: Float
    damagePerRound: Float
    killsPerRound: Float
    assistsPerRound: Float
    deathsPerRound: Float
    grenadeDamagePerRound: Float
    week: Int
    year: Int
  }
`;

export const resolvers = {
  Player: {
    statistics: parent =>
      parent.getStatistics({
        order: [['year', 'desc'], ['week', 'desc']]
      })
  }
};
