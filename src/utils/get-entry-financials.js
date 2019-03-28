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

export function getEntryPlayers(entry) {
  return entry.selections
    .filter(selection => !selection.deletedAt)
    .map(selection => selection.player);
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

export function getQuarterYear(quarter) {
  return 2018 + Math.ceil(quarter / 4);
}

export function normalizeQuarter(quarter) {
  return quarter % 4 || 4;
}

export function getQuarterlyFinancials(entries, quarters) {
  return quarters.reduce((acc, quarter) => {
    const quarterYear = getQuarterYear(quarter);
    const quarterDate = setQuarter(
      setYear(Date.now(), quarterYear),
      normalizeQuarter(quarter)
    );

    const quarterStart = startOfQuarter(quarterDate);
    const quarterEnd = endOfQuarter(quarterDate);

    const periodEndDate = Math.min(Date.now(), quarterEnd);
    const periodEndWeek = getISOWeek(periodEndDate);
    const periodEndYear = getISOWeekYear(periodEndDate);

    return {
      ...acc,
      [quarter]: entries
        .filter(entry => Number(entry.createdAt) <= quarterEnd)
        .map(entry => {
          const createdAt = Number(entry.createdAt);
          const periodStartDate = Math.max(createdAt, quarterStart);
          const periodStartWeek = getISOWeek(periodStartDate);
          const periodStartYear = getISOWeekYear(periodStartDate);

          const transactions = selectionsToTransactions(
            entry.selections,
            deletedAt => deletedAt < quarterEnd
          );

          const currentCash = transactionsToCash(transactions);
          const filteredTransactions = transactions.filter(
            transaction => transaction.date < periodStartDate
          );

          const initialCash = transactionsToCash(
            filteredTransactions.length
              ? filteredTransactions
              : transactions.slice(0, 5)
          );

          // filter out selections that were created after the quarter
          const selections = entry.selections.filter(
            selection => Number(selection.createdAt) <= quarterEnd
          );

          const initialValue = getSelectionsValue(
            selections,
            periodStartWeek,
            periodStartYear,
            deletedAt => deletedAt >= quarterStart
          );

          const currentValue = getSelectionsValue(
            selections,
            periodEndWeek,
            periodEndYear,
            deletedAt => deletedAt > quarterEnd
          );

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

  const transactions = selectionsToTransactions(entry.selections);
  const currentCash = transactionsToCash(transactions);
  return {
    startDate,
    startWeek,
    startYear,
    transactions,
    currentCash,
    ...getFinancials(
      initialValue,
      TOTAL_BUDGET - initialValue,
      getSelectionsValue(entry.selections, endWeek, endYear),
      currentCash
    )
  };
}
