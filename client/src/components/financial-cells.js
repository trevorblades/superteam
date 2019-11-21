import Diff from './diff';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {TableCell, Tooltip} from '@material-ui/core';
import {formatMoney} from '../utils/format';
import {round} from 'lodash';

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

export function FinancialCell({bold, children, ...props}) {
  return (
    <TableCell {...props}>
      {bold ? <strong>{children}</strong> : children}
    </TableCell>
  );
}

FinancialCell.propTypes = {
  bold: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default function FinancialCells(props) {
  const roi = (props.diff / props.initialValue) * 100;
  return [
    formatMoney(props.initialValue),
    formatMoney(props.currentValue),
    formatMoney(props.currentCash),
    <Diff key="diff" value={props.diff} />,
    `${round(roi, 2)} %`
  ].map((value, index) => (
    <FinancialCell key={index} align="right" bold={props.bold}>
      {value}
    </FinancialCell>
  ));
}

FinancialCells.propTypes = {
  bold: PropTypes.bool,
  currentValue: PropTypes.number.isRequired,
  currentCash: PropTypes.number.isRequired,
  initialValue: PropTypes.number.isRequired,
  diff: PropTypes.number.isRequired
};
