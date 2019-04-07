import Diff from './diff';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import round from 'lodash/round';
import {formatMoney} from '../utils/format';

export function FinancialHeaders() {
  return (
    <Fragment>
      <TableCell align="right">Initial</TableCell>
      <TableCell align="right">Current</TableCell>
      <TableCell align="right">Cash</TableCell>
      <TableCell align="right">Diff</TableCell>
      <TableCell align="right">
        <Tooltip title="Return on investment">
          <span>ROI</span>
        </Tooltip>
      </TableCell>
    </Fragment>
  );
}

export default function FinancialCells(props) {
  const roi = (props.diff / props.initialValue) * 100;
  const cells = [
    formatMoney(props.initialValue),
    formatMoney(props.currentValue),
    formatMoney(props.currentCash),
    <Diff key="diff" value={props.diff} />,
    `${round(roi, 2)} %`
  ];

  return cells.map((cell, index) => (
    <TableCell key={index} align="right" style={props.style}>
      {cell}
    </TableCell>
  ));
}

FinancialCells.propTypes = {
  currentValue: PropTypes.number.isRequired,
  currentCash: PropTypes.number.isRequired,
  initialValue: PropTypes.number.isRequired,
  diff: PropTypes.number.isRequired,
  style: PropTypes.object
};
