const {HLTV} = require('hltv');
const {formatISO, subYears} = require('date-fns');
const {sleep} = require('@shanyue/promise-utils');

function formatDate(date) {
  return formatISO(date, {representation: 'date'});
}

exports.sourceNodes = async ({actions, createNodeId, createContentDigest}) => {
  const endDate = new Date();
  const response = await HLTV.getPlayerRanking({
    rankingFilter: 'Top30',
    startDate: formatDate(subYears(endDate, 1)),
    endDate: formatDate(endDate)
  });

  const teams = {};

  for (const {id, rating} of response) {
    await sleep(1000); // add some delay for HLTV
    const player = await HLTV.getPlayer({id});

    if (player.team && !teams[player.team.id]) {
      await sleep(1000); // more delay
      teams[player.team.id] = await HLTV.getTeam({id: player.team.id});
    }

    actions.createNode({
      ...player,
      rating,
      team: player.team && teams[player.team.id],
      id: createNodeId(`player-${player.id}`),
      internal: {
        type: 'Player',
        content: JSON.stringify(player),
        contentDigest: createContentDigest(player)
      }
    });
  }
};
