import getISOWeek from 'date-fns/getISOWeek';
import getISOWeekYear from 'date-fns/getISOWeekYear';
import setQuarter from 'date-fns/setQuarter';
import startOfQuarter from 'date-fns/startOfQuarter';
import {TOTAL_BUDGET} from './constants';
import {getInitialPlayerCost, getTotalPlayerCost, sum} from './get-player-cost';

function getSelectionDate(player, ms) {
  const [{week, year}] = player.statistics;
  const date = new Date(ms);
  return {
    date,
    week: Math.min(week, getISOWeek(date)),
    year: Math.min(year, getISOWeekYear(date))
  };
}

function getTransaction(player, ms, modifier = 1) {
  const {date, week, year} = getSelectionDate(player, ms);
  return {
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

export default function getEntryFinancials(entry, quarter) {
  let quarterStart;
  if (quarter) {
    quarterStart = startOfQuarter(setQuarter(Date.now(), quarter));
    // quarterStart = new Date('2019-02-25');
  }

  const createdAt = Number(entry.createdAt);
  const initialSelections = entry.selections.slice(0, 5);
  const {date, week, year} = getSelectionDate(
    initialSelections[0].player,
    quarterStart ? Math.max(quarterStart.getTime(), createdAt) : createdAt
  );

  console.log(date, week, year);

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
        acc.push(getTransaction(player, Number(deletedAt)));
      }

      return [...acc, ...getTransaction(player, Number(createdAt), -1)];
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
    cash,
    transactions,
    initialValue,
    diff: totalValue - (initialValue + initialCash)
  };
}
