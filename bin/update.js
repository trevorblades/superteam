#!/usr/bin/env node -r esm -r dotenv/config
import {Entry, Player, Statistic, Team, sequelize} from '../src/db';
import {HLTV} from 'hltv';
import {Op} from 'sequelize';
import {format} from 'date-fns/fp';
import {sumRating} from '../src/utils';

const formatDate = format('yyyy-MM-dd');

async function update() {
  const end = new Date(); // pass a date in here to adjust time window (e.g. '2019-01-01')
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);

  const endDate = formatDate(end);
  const queryOptions = {
    matchType: 'Lan',
    rankingFilter: 'Top50',
    startDate: formatDate(start),
    endDate
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
  let updatedStats = 0;
  let updatedPlayers = 0;
  const players = await Player.findAll();
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    try {
      const {statistics} = await HLTV.getPlayerStats({
        ...queryOptions,
        id: player.id
      });

      const headshots = parseFloat(statistics.headshots).toPrecision(3) / 100;
      const statExists = await Statistic.count({
        where: {
          periodEndsAt: {
            [Op.gt]: new Date(end - 7 * 24 * 60 * 60 * 1000)
          },
          playerId: player.id
        }
      });

      if (!statExists) {
        await Statistic.create({
          ...statistics,
          headshots,
          periodEndsAt: endDate,
          playerId: player.id
        });

        updatedStats += 1;
      }

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
        country: country.code,
        rating: statistics.rating
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

  // calculate and save player percentiles
  const ratings = players.map(player => player.rating);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const delta = maxRating - minRating;
  await Promise.all(
    players.map(player => {
      const percentile = (player.rating - minRating) / delta;
      return player.update({
        percentile
      });
    })
  );

  // get all entries
  const entries = await Entry.findAll({
    include: [Player]
  });

  // update all entries with newest player stats
  let updatedEntries = 0;
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const totalRating = entry.players.reduce(sumRating, 0);
    const averageRating = totalRating / entry.players.length;
    await entry.update({
      currentRating: averageRating.toPrecision(3)
    });

    updatedEntries += 1;
  }

  // return the updated and new counts to display in the console output
  return {
    newPlayers,
    updatedStats,
    updatedPlayers,
    updatedEntries
  };
}

update().then(
  async ({newPlayers, updatedStats, updatedPlayers, updatedEntries}) => {
    await sequelize.close();
    console.log(`${newPlayers} players added`);
    console.log(`${updatedStats} stats updated`);
    console.log(`${updatedPlayers} players updated`);
    console.log(`${updatedEntries} entries updated`);
  }
);
