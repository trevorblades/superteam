import Sequelize from 'sequelize';

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  // logging: false
});

export const Player = sequelize.define('player', {
  name: Sequelize.STRING,
  ign: Sequelize.STRING,
  country: Sequelize.STRING,
  image: Sequelize.STRING,
  rating: Sequelize.FLOAT,
  percentile: Sequelize.FLOAT
});

export const Statistic = sequelize.define('statistic', {
  rating: Sequelize.FLOAT,
  kills: Sequelize.INTEGER,
  deaths: Sequelize.INTEGER,
  kdRatio: Sequelize.FLOAT,
  headshots: Sequelize.FLOAT,
  damagePerRound: Sequelize.FLOAT,
  killsPerRound: Sequelize.FLOAT,
  assistsPerRound: Sequelize.FLOAT,
  deathsPerRound: Sequelize.FLOAT,
  grenadeDamagePerRound: Sequelize.FLOAT,
  periodEndsAt: Sequelize.DATE
});

Player.hasMany(Statistic);
Statistic.belongsTo(Player);

export const Team = sequelize.define('team', {
  name: Sequelize.STRING,
  logo: Sequelize.STRING
});

Player.belongsTo(Team);
Team.hasMany(Player);

export const User = sequelize.define('user', {
  username: Sequelize.STRING,
  displayName: Sequelize.STRING,
  profileImage: Sequelize.STRING
});

export const Entry = sequelize.define('entry', {
  name: Sequelize.STRING,
  initialRating: Sequelize.FLOAT,
  currentRating: Sequelize.FLOAT
});

const Selection = sequelize.define('selection', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

User.hasMany(Entry);
Entry.belongsTo(User);
Entry.belongsToMany(Player, {through: Selection});
Player.belongsToMany(Entry, {through: Selection});
