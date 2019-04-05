import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  // logging: false
});

export const Player = sequelize.define('player', {
  name: Sequelize.STRING,
  ign: Sequelize.STRING,
  country: Sequelize.STRING,
  image: Sequelize.STRING
});

export const Statistic = sequelize.define('statistic', {
  rating: Sequelize.FLOAT,
  percentile: Sequelize.FLOAT,
  kills: Sequelize.INTEGER,
  deaths: Sequelize.INTEGER,
  kdRatio: Sequelize.FLOAT,
  headshots: Sequelize.FLOAT,
  damagePerRound: Sequelize.FLOAT,
  killsPerRound: Sequelize.FLOAT,
  assistsPerRound: Sequelize.FLOAT,
  deathsPerRound: Sequelize.FLOAT,
  grenadeDamagePerRound: Sequelize.FLOAT,
  week: Sequelize.INTEGER,
  year: Sequelize.INTEGER
});

Player.hasMany(Statistic);
Statistic.belongsTo(Player);

export const Team = sequelize.define('team', {
  name: Sequelize.STRING,
  logo: Sequelize.STRING
});

Player.belongsTo(Team);
Team.hasMany(Player);

const ENTRY_LIMIT = 3;
export const User = sequelize.define(
  'user',
  {
    email: Sequelize.STRING,
    name: Sequelize.STRING,
    image: Sequelize.STRING,
    following: Sequelize.BOOLEAN,
    twitterId: Sequelize.STRING,
    facebookId: Sequelize.STRING
  },
  {
    getterMethods: {
      entryLimit() {
        return ENTRY_LIMIT + Number(this.following);
      }
    }
  }
);

User.prototype.toJWT = function() {
  return jwt.sign(this.get(), process.env.TOKEN_SECRET);
};

export const Entry = sequelize.define('entry', {
  name: Sequelize.STRING,
  primary: Sequelize.BOOLEAN
});

User.hasMany(Entry);
Entry.belongsTo(User);

export const Selection = sequelize.define(
  'selection',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {paranoid: true}
);

Selection.belongsTo(Player);
Selection.belongsTo(Entry);
Player.hasMany(Selection);
Entry.hasMany(Selection);
