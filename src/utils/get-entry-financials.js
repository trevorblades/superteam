import getISOWeek from 'date-fns/getISOWeek';
import getISOWeekYear from 'date-fns/getISOWeekYear';
import sum from './sum';
import {TOTAL_BUDGET} from './constants';
import {getInitialPlayerCost, getTotalPlayerCost} from './get-player-cost';

export default function getEntryFinancials(entry) {
  const date = new Date(Number(entry.createdAt));
  const week = getISOWeek(date);
  const year = getISOWeekYear(date);
  const initialValue = entry.players
    .map(getInitialPlayerCost.bind(this, week, year))
    .reduce(sum);

  const initialRemainder = TOTAL_BUDGET - initialValue;
  const currentValue = getTotalPlayerCost(entry.players);
  return {
    date,
    totalValue: currentValue + initialRemainder,
    diff: currentValue - initialValue
  };
}
