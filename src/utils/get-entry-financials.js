import endOfQuarter from 'date-fns/endOfQuarter';
import getISOWeek from 'date-fns/getISOWeek';
import getISOWeekYear from 'date-fns/getISOWeekYear';
import setQuarter from 'date-fns/setQuarter';
import setYear from 'date-fns/setYear';
import startOfQuarter from 'date-fns/startOfQuarter';
import {TOTAL_BUDGET} from './constants';
import {getPlayerCostAtWeek, sum} from './get-player-cost';

function getSelectionDate(selection, selectedAt) {
  const [{week, year}] = selection.player.statistics;
  const date = new Date(Number(selectedAt));
  return {
    date,
    week: Math.min(week, getISOWeek(date)),
    year: Math.min(year, getISOWeekYear(date))
  };
}

function selectionsToTransactions(selections, filter) {
  // loop through selections to save additions and subtractions and sort them in
  // the order that they happened
  return selections
    .reduce((acc, selection) => {
      const {createdAt, deletedAt} = selection;
      if (deletedAt && (!filter || filter(Number(deletedAt)))) {
        acc.push(selectionToTransaction(selection, deletedAt));
      }

      return [...acc, selectionToTransaction(selection, createdAt, -1)];
    }, [])
    .sort((a, b) => a.date - b.date);
}

function selectionToTransaction(selection, selectedAt, modifier = 1) {
  const {player} = selection;
  const {date, week, year} = getSelectionDate(selection, selectedAt);
  return {
    date,
    player,
    amount: getPlayerCostAtWeek(player, week, year) * modifier
  };
}

function transactionsToCash(transactions) {
  // get current cash by making the transactions against starting cash
  return transactions
    .map(transaction => transaction.amount)
    .reduce(sum, TOTAL_BUDGET);
}

function getSelectionsValue(selections, week, year, filter) {
  return selections
    .filter(
      selection =>
        !selection.deletedAt || (filter && filter(Number(selection.deletedAt)))
    )
    .slice(0, 5)
    .map(selection => getPlayerCostAtWeek(selection.player, week, year))
    .reduce(sum);
}

function getFinancials(currentValue, currentCash, initialValue, initialCash) {
  return {
    initialValue,
    currentValue,
    diff: currentValue + currentCash - (initialValue + initialCash)
  };
}

export function getEntryPlayers(entry) {
  return entry.selections
    .filter(selection => !selection.deletedAt)
    .map(selection => selection.player);
}

export function getQuarterDate(quarter) {
  const normalized = quarter % 4 || 4;
  const year = 2018 + Math.ceil(quarter / 4);
  const date = setQuarter(setYear(Date.now(), year), normalized);
  return {
    label: `Q${normalized} ${year}`,
    start: startOfQuarter(date),
    end: endOfQuarter(date)
  };
}

export function getQuarterlyFinancials(entries, quarters) {
  return quarters.reduce((acc, quarter) => {
    const {start, end} = getQuarterDate(quarter);
    const periodEndDate = Math.min(Date.now(), end);
    const periodEndWeek = getISOWeek(periodEndDate);
    const periodEndYear = getISOWeekYear(periodEndDate);
    return {
      ...acc,
      [quarter]: entries
        .filter(entry => Number(entry.createdAt) <= end)
        .map(entry => {
          const createdAt = Number(entry.createdAt);
          const periodStartDate = Math.max(createdAt, start);
          const periodStartWeek = getISOWeek(periodStartDate);
          const periodStartYear = getISOWeekYear(periodStartDate);

          // get all transactions leading up to and including quarter
          const allTransactions = selectionsToTransactions(
            entry.selections,
            deletedAt => deletedAt <= end
          );

          // get all transactions leading up to quarter start
          const filteredTransactions = allTransactions.filter(
            transaction => transaction.date < periodStartDate
          );

          // filter out selections that were created after the quarter
          const selections = entry.selections.filter(
            selection => Number(selection.createdAt) <= end
          );

          const initialValue = getSelectionsValue(
            selections,
            periodStartWeek,
            periodStartYear,
            deletedAt => deletedAt >= start
          );

          const initialCash = transactionsToCash(
            filteredTransactions.length
              ? filteredTransactions
              : allTransactions.slice(0, 5)
          );

          const currentValue = getSelectionsValue(
            selections,
            periodEndWeek,
            periodEndYear,
            deletedAt => deletedAt > end
          );

          const currentCash = transactionsToCash(allTransactions);
          return {
            ...entry,
            ...getFinancials(
              initialValue,
              initialCash,
              currentValue,
              currentCash
            )
          };
        })
        .sort((a, b) => b.diff - a.diff)
    };
  }, {});
}

export default function getEntryFinancials(entry) {
  const startDate = Number(entry.createdAt);
  const startWeek = getISOWeek(startDate);
  const startYear = getISOWeekYear(startDate);

  const endDate = Date.now();
  const endWeek = getISOWeek(endDate);
  const endYear = getISOWeekYear(endDate);

  const initialValue = getSelectionsValue(
    entry.selections,
    startWeek,
    startYear
  );

  const initialCash = TOTAL_BUDGET - initialValue;
  const currentValue = getSelectionsValue(entry.selections, endWeek, endYear);
  const transactions = selectionsToTransactions(entry.selections);
  const currentCash = transactionsToCash(transactions);
  return {
    startDate,
    startWeek,
    startYear,
    transactions,
    currentCash,
    ...getFinancials(initialValue, initialCash, currentValue, currentCash)
  };
}
