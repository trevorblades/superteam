#!/usr/bin/env node -r esm -r dotenv/config
import format from 'date-fns/format';
import getISOWeek from 'date-fns/getISOWeek';
import getISOWeekYear from 'date-fns/getISOWeekYear';
import {HLTV} from 'hltv';
import {Player, Statistic, Team, sequelize} from '../src/db';

const datePattern = 'yyyy-MM-dd';
async function update() {
  const end = new Date('2019-01-08'); // pass a date in here to adjust time window (e.g. '2019-01-01')
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);

  const queryOptions = {
    matchType: 'Lan',
    rankingFilter: 'Top50',
    startDate: format(start, datePattern),
    endDate: format(end, datePattern)
  };

  const playerRanking = await HLTV.getPlayerRanking(queryOptions);

  // first, we loop through the most recent ranking and add any newcomers to the
  // players table
  let newPlayers = 0;
  for (let i = 0; i < playerRanking.length; i++) {
    const {id, name} = playerRanking[i];
    const exists = await Player.count({
      where: {
        id
      }
    });

    if (!exists) {
      await Player.create({id});
      newPlayers += 1;
      console.log(`Player "${name}" added`);
    }
  }

  // next, we loop through all the players in the players table and retrieve
  // up-to-date information and statistics
  let updatedPlayers = 0;
  const week = getISOWeek(end);
  const year = getISOWeekYear(end);
  const players = await Player.findAll({
    include: [
      {
        model: Statistic,
        required: false,
        where: {
          week,
          year
        }
      }
    ]
  });

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    if (!player.statistics.length) {
      try {
        const {statistics} = await HLTV.getPlayerStats({
          ...queryOptions,
          id: player.id
        });

        const headshots = parseFloat(statistics.headshots).toPrecision(3) / 100;
        const statistic = await Statistic.create({
          ...statistics,
          headshots,
          week,
          year
        });

        await player.addStatistic(statistic);
        player.setDataValue('statistics', [statistic]);

        const {
          ign,
          name,
          country,
          image,
          team: playerTeam
        } = await HLTV.getPlayer({
          id: player.id
        });

        await player.update({
          ign,
          name,
          image,
          country: country.code
        });

        if (playerTeam) {
          let team = await Team.findByPk(playerTeam.id);
          if (!team) {
            const {name, logo} = await HLTV.getTeam({id: playerTeam.id});
            team = await Team.create({
              id: playerTeam.id,
              name,
              logo
            });

            console.log(`Team "${name}" added`);
          }

          await player.setTeam(team);
        }

        updatedPlayers += 1;
        console.log(`Player "${ign}" updated`);
      } catch (error) {
        console.error(error);
      }
    }
  }

  // create an array of all current player ratings
  const ratings = players.map(player => {
    const [{rating}] = player.getDataValue('statistics');
    return rating;
  });

  // calculate their percentile and update the statistic row
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const delta = maxRating - minRating;
  await Promise.all(
    players.map(player => {
      const [statistic] = player.getDataValue('statistics');
      return statistic.update({
        percentile: (statistic.rating - minRating) / delta
      });
    })
  );

  // return the updated and new counts to display in the console output
  return {
    newPlayers,
    updatedPlayers
  };
}

update().then(async ({newPlayers, updatedPlayers}) => {
  await sequelize.close();
  console.log(`${newPlayers} players added`);
  console.log(`${updatedPlayers} players updated`);
});
