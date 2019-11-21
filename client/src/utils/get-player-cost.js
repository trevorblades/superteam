import {TEAM_SIZE, TOTAL_BUDGET} from './constants';

const AVG_PLAYER_COST = TOTAL_BUDGET / TEAM_SIZE;
const COST_EXPONENT = 2.9;
const COST_MODIFIER = 0.7;
export function ratingToCost(rating) {
  const cost =
    AVG_PLAYER_COST * Math.pow(rating, COST_EXPONENT) * COST_MODIFIER;
  return Math.round(cost);
}

export function getPlayerStatsAtWeek(player, week, year) {
  return player.statistics.find(
    statistic => statistic.week <= week && statistic.year <= year
  );
}

export function getPlayerCostAtWeek(player, week, year) {
  const {rating} = getPlayerStatsAtWeek(player, week, year);
  return ratingToCost(rating);
}

export default function getPlayerCost(player) {
  const [{rating}] = player.statistics;
  return ratingToCost(rating);
}
