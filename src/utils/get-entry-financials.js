import getISOWeek from 'date-fns/getISOWeek';
import getISOWeekYear from 'date-fns/getISOWeekYear';
import sum from './sum';
import {TOTAL_BUDGET} from './constants';
import {getInitialPlayerCost, getTotalPlayerCost} from './get-player-cost';

export function getEntryDate(createdAt) {
  const date = new Date(Number(createdAt));
  return {
    date,
    week: getISOWeek(date),
    year: getISOWeekYear(date)
  };
}

export default function getEntryFinancials(entry) {
  const {date, week, year} = getEntryDate(entry.createdAt);
  const initialValue = entry.players
    .map(getInitialPlayerCost.bind(this, week, year))
    .reduce(sum);

  const initialRemainder = TOTAL_BUDGET - initialValue;
  const currentValue = getTotalPlayerCost(entry.players);
  return {
    date,
    week,
    year,
    totalValue: currentValue + initialRemainder,
    diff: currentValue - initialValue
  };
}
