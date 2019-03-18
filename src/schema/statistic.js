import {gql} from 'apollo-server-express';

export const typeDef = gql`
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
