import Sequelize from 'sequelize';

export const sequelize = new Sequelize(process.env.DATABASE_URL);

export const Player = sequelize.define('player', {
  name: Sequelize.STRING,
  ign: Sequelize.STRING,
  country: Sequelize.STRING,
  image: Sequelize.STRING,
  rating: Sequelize.FLOAT
});

export const Team = sequelize.define('team', {
  name: Sequelize.STRING,
  logo: Sequelize.STRING
});

Player.belongsTo(Team);
Team.hasMany(Player);
