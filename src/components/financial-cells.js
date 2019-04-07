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

function FinancialCell(props) {
  return (
    <TableCell align="right">
      {props.bold ? <strong>{props.children}</strong> : props.children}
    </TableCell>
  );
}

FinancialCell.propTypes = {
  bold: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default function FinancialCells(props) {
  const roi = (props.diff / props.initialValue) * 100;
  return (
    <Fragment>
      <FinancialCell bold={props.bold}>
        {formatMoney(props.initialValue)}
      </FinancialCell>
      <FinancialCell bold={props.bold}>
        {formatMoney(props.currentValue)}
      </FinancialCell>
      <FinancialCell bold={props.bold}>
        {formatMoney(props.currentCash)}
      </FinancialCell>
      <FinancialCell bold={props.bold}>
        <Diff value={props.diff} />
      </FinancialCell>
      <FinancialCell bold={props.bold}>{round(roi, 2)} %</FinancialCell>
    </Fragment>
  );
}

FinancialCells.propTypes = {
  bold: PropTypes.bool,
  currentValue: PropTypes.number.isRequired,
  currentCash: PropTypes.number.isRequired,
  initialValue: PropTypes.number.isRequired,
  diff: PropTypes.number.isRequired
};
