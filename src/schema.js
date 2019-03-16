import {AuthenticationError, UserInputError, gql} from 'apollo-server-express';
import {Entry, Player, Selection, Statistic, Team} from './db';
import {Op} from 'sequelize';

export const typeDefs = gql`
  type Player {
    id: ID
    name: String
    ign: String
    country: String
    image: String
    team: Team
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

  type Team {
    id: ID
    name: String
    logo: String
    players: [Player]
  }

  type User {
    username: String
    displayName: String
    profileImage: String
  }

  type Entry {
    id: ID
    name: String
    createdAt: String
    user: User
    selections: [Selection]
  }

  type Selection {
    id: ID
    createdAt: String
    deletedAt: String
    player: Player
  }

  type Query {
    team(id: ID!): Team
    teams: [Team]
    player(id: ID!): Player
    players: [Player]
    entry(id: ID!): Entry
    entries: [Entry]
    standings: [Entry]
  }

  type Mutation {
    createEntry(name: String!, playerIds: [String]!): Entry
    updateEntry(id: ID!, playerIds: [String]!): Entry
  }
`;

export const resolvers = {
  Player: {
    team: parent => parent.getTeam(),
    statistics: parent =>
      parent.getStatistics({
        order: [['year', 'desc'], ['week', 'desc']]
      })
  },
  Entry: {
    selections: parent =>
      parent.getSelections({
        paranoid: false,
        order: ['id']
      })
  },
  Selection: {
    player: parent => parent.getPlayer()
  },
  Query: {
    team: (parent, args) => Team.findByPk(args.id),
    teams: () => Team.findAll(),
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
      }),
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
