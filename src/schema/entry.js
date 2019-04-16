import {AuthenticationError, UserInputError, gql} from 'apollo-server-express';
import {Entry, Selection} from '../db';
import {Op} from 'sequelize';

export const typeDef = gql`
  extend type Query {
    entryLimit: Int
    entry(id: ID!): Entry
    entries: [Entry]
    standings: [Entry]
  }

  extend type Mutation {
    createEntry(name: String!, playerIds: [String]!): Entry
    updateEntry(id: ID!, playerIds: [String]!): Entry
    setPrimaryEntry(id: ID!): Entry
  }

  type Entry {
    id: ID
    name: String
    primary: Boolean
    createdAt: String
    userId: ID
  }
`;

async function getEntryForUser(user, id) {
  if (!user) {
    throw new AuthenticationError('Unauthorized');
  }

  const [entry] = await user.getEntries({
    where: {
      id
    }
  });

  if (!entry) {
    throw new UserInputError('Entry not found');
  }

  return entry;
}

export const resolvers = {
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
    standings: () =>
      Entry.findAll({
        where: {
          primary: true
        }
      })
  },
  Mutation: {
    async createEntry(parent, args, {user}) {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const numEntries = await Entry.count({
        where: {
          userId: user.id
        }
      });

      if (numEntries >= user.entryLimit) {
        throw new UserInputError(
          `You cannot create any more teams (max. ${user.entryLimit})`
        );
      }

      const entry = await Entry.create({
        name: args.name,
        primary: !numEntries,
        userId: user.id
      });

      const selections = await Selection.bulkCreate(
        args.playerIds.map(playerId => ({playerId})),
        {returning: true}
      );

      await entry.setSelections(selections);
      return entry;
    },
    async updateEntry(parent, args, {user}) {
      const entry = await getEntryForUser(user, args.id);
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
    },
    async setPrimaryEntry(parent, args, {user}) {
      const entry = await getEntryForUser(user, args.id);
      const entries = await user.getEntries({
        where: {
          id: {
            [Op.not]: args.id
          }
        }
      });

      await Promise.all(entries.map(entry => entry.update({primary: false})));
      return entry.update({primary: true});
    }
  }
};
