const {HLTV} = require('hltv');
const {AVERATE_PLAYER_COST} = require('./src/util');

const template = require.resolve('./src/components/team-builder');
exports.createPages = async ({graphql, actions}) => {
  const playerRanking = await HLTV.getPlayerRanking({
    startDate: '2018-01-01',
    endDate: '2018-12-31',
    matchType: 'Lan',
    rankingFilter: 'Top50'
  });

  const ratings = playerRanking.map(player => player.rating);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const delta = maxRating - minRating;

  const {data} = await graphql(`
    {
      countries {
        continents {
          code
          name
          countries {
            code
          }
        }
      }
    }
  `);

  const players = await Promise.all(
    playerRanking.map(async ({id, rating}) => {
      const player = await HLTV.getPlayer({id});
      const {statistics} = await HLTV.getPlayerStats({id});
      const team = player.team
        ? await HLTV.getTeam({id: player.team.id})
        : null;

      const percentile = (rating - minRating) / delta;
      const cost = AVERATE_PLAYER_COST * (percentile + 0.5);

      const continent = data.countries.continents.find(({countries}) =>
        countries.some(country => country.code === player.country.code)
      );

      return {
        ...player,
        team,
        cost: Math.round(cost),
        percentile,
        region: continent.code,
        statistics: {
          ...statistics,
          rating
        }
      };
    })
  );

  // get a distinct set of countries from the players
  const countries = Array.from(
    new Set(players.map(player => player.country.code))
  );

  // filter out continents with no players
  const continents = data.countries.continents.filter(continent =>
    continent.countries.some(country => countries.includes(country.code))
  );

  actions.createPage({
    path: '/',
    component: template,
    context: {
      players,
      continents
    }
  });
};
