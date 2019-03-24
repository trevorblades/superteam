import Diff from './diff';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import TableCell from '@material-ui/core/TableCell';
import round from 'lodash/round';
import {formatMoney} from '../utils/format';

export function FinancialHeaders() {
  return (
    <Fragment>
      <TableCell align="right">Player value</TableCell>
      <TableCell align="right">Total value</TableCell>
      <TableCell align="right">Gain/loss</TableCell>
      <TableCell align="right">ROI</TableCell>
    </Fragment>
  );
}

export default function FinancialCells(props) {
  const roi = (props.diff / props.initialValue) * 100;
  return (
    <Fragment>
      <TableCell align="right">{formatMoney(props.playerValue)}</TableCell>
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
  totalValue: PropTypes.number.isRequired,
  initialValue: PropTypes.number.isRequired,
  diff: PropTypes.number.isRequired
};
