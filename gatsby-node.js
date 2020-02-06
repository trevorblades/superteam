const {HLTV} = require('hltv');
const formatISO = require('date-fns/formatISO');
const subYears = require('date-fns/subYears');

function formatDate(date) {
  return formatISO(date, {representation: 'date'});
}

exports.sourceNodes = async ({actions, createNodeId, createContentDigest}) => {
  const endDate = new Date();
  const response = await HLTV.getPlayerRanking({
    matchType: 'BigEvents',
    rankingFilter: 'Top50',
    startDate: formatDate(subYears(endDate, 1)),
    endDate: formatDate(endDate)
  });

  for (const {id} of response) {
    const player = await HLTV.getPlayer({id});
    actions.createNode({
      ...player,
      team: player.team && (await HLTV.getTeam({id: player.team.id})),
      id: createNodeId(`player-${player.id}`),
      internal: {
        type: 'Player',
        content: JSON.stringify(player),
        contentDigest: createContentDigest(player)
      }
    });
  }
};
