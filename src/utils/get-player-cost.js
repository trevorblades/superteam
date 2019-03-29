import {AVERATE_PLAYER_COST} from './constants';

export function percentileToCost(percentile) {
  const cost = AVERATE_PLAYER_COST * (percentile + 0.5);
  return Math.round(cost);
}

export function getPlayerStatsAtWeek(player, week, year) {
  return player.statistics.find(
    statistic => statistic.week <= week && statistic.year <= year
  );
}

export function getPlayerCostAtWeek(player, week, year) {
  const {percentile} = getPlayerStatsAtWeek(player, week, year);
  return percentileToCost(percentile);
}

export function sum(a, b) {
  return a + b;
}

export default function getPlayerCost(player) {
  const [statistic] = player.statistics;
  return percentileToCost(statistic.percentile);
}
