import Diff from './diff';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import TableCell from '@material-ui/core/TableCell';
import round from 'lodash/round';
import {formatMoney} from '../utils/format';

export function FinancialHeaders(props) {
  return (
    <Fragment>
      <TableCell align="right">Players</TableCell>
      {!props.hideCash && <TableCell align="right">Cash</TableCell>}
      <TableCell align="right">Total</TableCell>
      <TableCell align="right">Diff</TableCell>
      <TableCell align="right">ROI</TableCell>
    </Fragment>
  );
}

FinancialHeaders.propTypes = {
  hideCash: PropTypes.bool
};

export default function FinancialCells(props) {
  const roi = (props.diff / props.initialValue) * 100;
  return (
    <Fragment>
      <TableCell align="right">{formatMoney(props.playerValue)}</TableCell>
      {Number.isInteger(props.cash) && (
        <TableCell align="right">{formatMoney(props.cash)}</TableCell>
      )}
      <TableCell align="right">{formatMoney(props.totalValue)}</TableCell>
      <TableCell align="right">
        <Diff value={props.diff} />
      </TableCell>
      <TableCell align="right">{round(roi, 2)} %</TableCell>
    </Fragment>
  );
}

FinancialCells.propTypes = {
  playerValue: PropTypes.number.isRequired,
  cash: PropTypes.number,
  totalValue: PropTypes.number.isRequired,
  initialValue: PropTypes.number.isRequired,
  diff: PropTypes.number.isRequired
};
