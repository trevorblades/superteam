import getISOWeek from 'date-fns/getISOWeek';
import getISOWeekYear from 'date-fns/getISOWeekYear';
import sum from './sum';
import {TOTAL_BUDGET} from './constants';
import {getInitialPlayerCost, getTotalPlayerCost} from './get-player-cost';

export function getEntryDate(entry) {
  const [{statistics}] = entry.players;
  const [{week, year}] = statistics;
  const date = new Date(Number(entry.createdAt));
  return {
    date,
    week: Math.min(week, getISOWeek(date)),
    year: Math.min(year, getISOWeekYear(date))
  };
}

export default function getEntryFinancials(entry) {
  const {date, week, year} = getEntryDate(entry);
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
