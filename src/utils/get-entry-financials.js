import endOfQuarter from 'date-fns/endOfQuarter';
import getISOWeek from 'date-fns/getISOWeek';
import getISOWeekYear from 'date-fns/getISOWeekYear';
import orderBy from 'lodash/orderBy';
import setQuarter from 'date-fns/setQuarter';
import setYear from 'date-fns/setYear';
import startOfQuarter from 'date-fns/startOfQuarter';
import {TOTAL_BUDGET} from './constants';
import {getPlayerCostAtWeek, getPlayerStatsAtWeek} from './get-player-cost';

export function sum(a, b) {
  return a + b;
}

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

function getSelectionValue(selections, week, year) {
  return selections
    .map(selection => getPlayerCostAtWeek(selection.player, week, year))
    .reduce(sum);
}

function getFilteredSelections(selections, filter) {
  return selections
    .filter(
      selection =>
        !selection.deletedAt || (filter && filter(Number(selection.deletedAt)))
    )
    .slice(0, 5);
}

function getFilteredSelectionValue(selections, week, year, filter) {
  return getSelectionValue(
    getFilteredSelections(selections, filter),
    week,
    year
  );
}

function getFinancials({initialValue, initialCash, currentValue, currentCash}) {
  return {
    initialValue,
    currentValue,
    currentCash,
    diff: currentValue + currentCash - (initialValue + initialCash)
  };
}

export function getEntryPlayers(entry) {
  return entry.selections
    .filter(selection => !selection.deletedAt)
    .map(selection => ({
      ...selection.player,
      selectedAt: selection.createdAt
    }));
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

export const rankingCriteria = ['diff', 'currentValue', 'totalKills'];
export function getQuarterlyFinancials(entries, quarters, date) {
  return quarters.reduce((acc, quarter) => {
    const {start, end} = getQuarterDate(quarter);
    const periodEndDate = Math.min(date, end);
    const periodEndWeek = getISOWeek(periodEndDate);
    const periodEndYear = getISOWeekYear(periodEndDate);

    const standings = entries
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

        const initialValue = getFilteredSelectionValue(
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

        const currentSelections = getFilteredSelections(
          selections,
          deletedAt => deletedAt > end
        );

        const currentValue = getSelectionValue(
          currentSelections,
          periodEndWeek,
          periodEndYear
        );

        const totalKills = currentSelections
          .map(selection => {
            const {kills} = getPlayerStatsAtWeek(
              selection.player,
              periodEndWeek,
              periodEndYear
            );
            return kills;
          })
          .reduce(sum);

        const currentCash = transactionsToCash(allTransactions);
        return {
          ...entry,
          totalKills,
          ...getFinancials({
            initialValue,
            initialCash,
            currentValue,
            currentCash
          })
        };
      });

    return {
      ...acc,
      [quarter]: orderBy(
        standings,
        rankingCriteria,
        Array(rankingCriteria.length).fill('desc')
      )
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

  const initialValue = getSelectionValue(
    entry.selections.slice(0, 5),
    startWeek,
    startYear
  );

  const initialCash = TOTAL_BUDGET - initialValue;
  const currentValue = getFilteredSelectionValue(
    entry.selections,
    endWeek,
    endYear
  );

  const transactions = selectionsToTransactions(entry.selections);
  const currentCash = transactionsToCash(transactions);
  return {
    startDate,
    startWeek,
    startYear,
    transactions,
    ...getFinancials({initialValue, initialCash, currentValue, currentCash})
  };
}
