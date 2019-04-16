import {gql} from 'apollo-server-express';

export const typeDef = gql`
  extend type Entry {
    selections: [Selection]
  }

  type Selection {
    id: ID
    createdAt: String
    deletedAt: String
  }
`;

export const resolvers = {
  Entry: {
    selections: parent =>
      parent.getSelections({
        paranoid: false,
        order: ['id']
      })
  }
};
