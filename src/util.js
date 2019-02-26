export const TEAM_SIZE = 5;
export const TOTAL_BUDGET = 16000;
export const AVERATE_PLAYER_COST = TOTAL_BUDGET / TEAM_SIZE;

export function getPlayerCardProps(rating, minRating, delta) {
  const percentile = (rating - minRating) / delta;
  const cost = AVERATE_PLAYER_COST * (percentile + 0.5);
  return {
    percentile,
    cost: Math.round(cost)
  };
}
