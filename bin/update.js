#!/usr/bin/env node -r esm -r dotenv/config
import {HLTV} from 'hltv';
import {Player, Statistics, Team, sequelize} from '../db';

async function update() {
  const playerRanking = await HLTV.getPlayerRanking({
    startDate: '2018-01-01',
    endDate: '2018-12-31',
    matchType: 'Lan',
    rankingFilter: 'Top50'
  });

  let updated = 0;
  for (let i = 0; i < playerRanking.length; i++) {
    const {id, rating} = playerRanking[i];
    const {name, ign, country, image, team: playerTeam} = await HLTV.getPlayer({
      id
    });

    try {
      let player = await Player.findByPk(id);
      if (!player) {
        player = await Player.create({
          id,
          name,
          ign,
          country: country.code
        });
      }

      await player.update({
        image,
        rating
      });

      const {statistics} = await HLTV.getPlayerStats({id});
      const headshots = parseFloat(statistics.headshots).toPrecision(3) / 100;
      await Statistics.upsert({
        ...statistics,
        headshots,
        playerId: id
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
        }

        await player.setTeam(team);
      }

      updated += 1;
    } catch (error) {
      console.log(ign, error.message);
    }
  }

  return updated;
}

update().then(async updated => {
  await sequelize.close();
  console.log(`${updated} players updated`);
});
