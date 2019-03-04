import Sequelize from 'sequelize';

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false
});

export const Player = sequelize.define('player', {
  name: Sequelize.STRING,
  ign: Sequelize.STRING,
  country: Sequelize.STRING,
  image: Sequelize.STRING,
  rating: Sequelize.FLOAT,
  kills: Sequelize.INTEGER,
  headshots: Sequelize.FLOAT,
  deaths: Sequelize.INTEGER,
  kdRatio: Sequelize.FLOAT,
  damagePerRound: Sequelize.FLOAT
});

export const Team = sequelize.define('team', {
  name: Sequelize.STRING,
  logo: Sequelize.STRING
});

Player.belongsTo(Team);
Team.hasMany(Player);
