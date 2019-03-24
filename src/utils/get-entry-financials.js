import getISOWeek from 'date-fns/getISOWeek';
import getISOWeekYear from 'date-fns/getISOWeekYear';
import {TOTAL_BUDGET} from './constants';
import {getInitialPlayerCost, getTotalPlayerCost, sum} from './get-player-cost';

export function getEntryDate(entry) {
  const [selection] = entry.selections;
  return getSelectionDate(selection.player, selection.createdAt);
}

function getSelectionDate(player, ms) {
  const [{week, year}] = player.statistics;
  const date = new Date(Number(ms));
  return {
    date,
    week: Math.min(week, getISOWeek(date)),
    year: Math.min(year, getISOWeekYear(date))
  };
}

function getTransaction(player, ms, modifier = 1) {
  const {date, week, year} = getSelectionDate(player, ms);
  return {
    id: player.id + ms,
    date,
    player,
    amount: getInitialPlayerCost(week, year, player) * modifier
  };
}

export function getEntryPlayers(entry) {
  return entry.selections
    .filter(selection => !selection.deletedAt)
    .map(selection => selection.player);
}

export default function getEntryFinancials(entry) {
  const {date, week, year} = getEntryDate(entry);
  const initialSelections = entry.selections.slice(0, 5);
  const initialValue = initialSelections
    .map(selection => selection.player)
    .map(getInitialPlayerCost.bind(this, week, year))
    .reduce(sum);

  // loop through selections to save additions and subtractions and sort them in
  // the order that they happened
  const transactions = entry.selections
    .reduce((acc, selection) => {
      const {player, createdAt, deletedAt} = selection;
      if (deletedAt) {
        acc.push(getTransaction(player, deletedAt));
      }

      return [...acc, ...getTransaction(player, createdAt, -1)];
    }, [])
    .sort((a, b) => a.date - b.date);

  // get current cash by making the transactions against starting cash
  const cash = transactions
    .map(transaction => transaction.amount)
    .reduce(sum, TOTAL_BUDGET);

  const players = getEntryPlayers(entry);
  const playerValue = getTotalPlayerCost(players);
  const totalValue = playerValue + cash;
  const initialCash = TOTAL_BUDGET - initialValue;
  return {
    date,
    week,
    year,
    players,
    playerValue,
    totalValue,
    transactions,
    initialValue,
    diff: totalValue - (initialValue + initialCash)
  };
}
