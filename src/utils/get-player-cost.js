import {AVERATE_PLAYER_COST} from './constants';

export function percentileToCost(percentile) {
  const cost = AVERATE_PLAYER_COST * (percentile + 0.5);
  return Math.round(cost);
}

export default function getPlayerCost(player) {
  const [statistic] = player.statistics;
  return percentileToCost(statistic.percentile);
}
