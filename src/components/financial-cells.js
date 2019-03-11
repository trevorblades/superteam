import Diff from './diff';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import TableCell from '@material-ui/core/TableCell';
import formatMoney from '../utils/format-money';
import getISOWeek from 'date-fns/getISOWeek';
import getISOWeekYear from 'date-fns/getISOWeekYear';
import getPlayerCost, {getInitialPlayerCost} from '../utils/get-player-cost';
import sum from '../utils/sum';
import {TOTAL_BUDGET} from '../utils/constants';

export function FinancialHeaders() {
  return (
    <Fragment>
      <TableCell align="right">Total value</TableCell>
      <TableCell align="right">Gain/loss</TableCell>
    </Fragment>
  );
}

export default function FinancialCells(props) {
  const week = getISOWeek(props.createdAt);
  const year = getISOWeekYear(props.createdAt);
  const initialValue = props.players
    .map(getInitialPlayerCost.bind(this, week, year))
    .reduce(sum);

  const initialRemainder = TOTAL_BUDGET - initialValue;
  const currentValue = props.players.map(getPlayerCost).reduce(sum);
  const adjustedValue = currentValue + initialRemainder;
  return (
    <Fragment>
      <TableCell align="right">{formatMoney(adjustedValue)}</TableCell>
      <TableCell align="right">
        <Diff value={currentValue - initialValue} />
      </TableCell>
    </Fragment>
  );
}

FinancialCells.propTypes = {
  createdAt: PropTypes.instanceOf(Date).isRequired,
  players: PropTypes.array.isRequired
};
