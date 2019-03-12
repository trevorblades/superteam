import Diff from './diff';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import TableCell from '@material-ui/core/TableCell';
import formatMoney from '../utils/format-money';

export function FinancialHeaders() {
  return (
    <Fragment>
      <TableCell align="right">Player value</TableCell>
      <TableCell align="right">Cash</TableCell>
      <TableCell align="right">Total value</TableCell>
      <TableCell align="right">Gain/loss</TableCell>
    </Fragment>
  );
}

export default function FinancialCells(props) {
  return (
    <Fragment>
      <TableCell align="right">{formatMoney(props.playerValue)}</TableCell>
      <TableCell align="right">{formatMoney(props.cash)}</TableCell>
      <TableCell align="right">{formatMoney(props.totalValue)}</TableCell>
      <TableCell align="right">
        <Diff value={props.diff} />
      </TableCell>
    </Fragment>
  );
}

FinancialCells.propTypes = {
  playerValue: PropTypes.number.isRequired,
  cash: PropTypes.number.isRequired,
  totalValue: PropTypes.number.isRequired,
  diff: PropTypes.number.isRequired
};
