import {AuthenticationError, UserInputError, gql} from 'apollo-server-express';
import {Entry, Selection} from '../db';
import {Op} from 'sequelize';

export const typeDef = gql`
  extend type Query {
    entry(id: ID!): Entry
    entries: [Entry]
    standings: [Entry]
  }

  extend type Mutation {
    createEntry(name: String!, playerIds: [String]!): Entry
    updateEntry(id: ID!, playerIds: [String]!): Entry
  }

  type Entry {
    id: ID
    name: String
    createdAt: String
    user: User
    selections: [Selection]
  }
`;

export const resolvers = {
  Entry: {
    selections: parent =>
      parent.getSelections({
        paranoid: false,
        order: ['id']
      })
  },
  Query: {
    entry: async (parent, args, {user}) => {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const [entry] = await user.getEntries({
        where: {
          id: args.id
        }
      });

      if (!entry) {
        throw new UserInputError('Entry not found');
      }

      return entry;
    },
    entries: (parent, args, {user}) => {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      return user.getEntries({
        order: [['createdAt', 'desc']]
      });
    },
    // TODO: reconsider how this works...
    standings: () => Entry.findAll({limit: 24})
  },
  Mutation: {
    async createEntry(parent, args, {user}) {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const entry = await Entry.create({name: args.name});
      await entry.setUser(user);

      const selections = await Selection.bulkCreate(
        args.playerIds.map(playerId => ({playerId})),
        {returning: true}
      );

      await entry.setSelections(selections);
      return entry;
    },
    async updateEntry(parent, args, {user}) {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const [entry] = await user.getEntries({
        where: {
          id: args.id
        }
      });

      if (!entry) {
        throw new UserInputError('Entry not found');
      }

      await Selection.destroy({
        where: {
          entryId: entry.id,
          playerId: {
            [Op.notIn]: args.playerIds
          }
        }
      });

      const existingPlayers = await entry
        .getSelections()
        .then(selections => selections.map(selection => selection.playerId));

      await Selection.bulkCreate(
        args.playerIds
          .map(Number)
          .filter(playerId => !existingPlayers.includes(playerId))
          .map(playerId => ({
            playerId,
            entryId: entry.id
          })),
        {returning: true}
      );

      entry.changed('updatedAt', true);
      return entry.save();
    }
  }
};
