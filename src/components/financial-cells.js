import Diff from './diff';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import TableCell from '@material-ui/core/TableCell';
import styled from '@emotion/styled';
import {formatMoney} from '../utils/format';
import {transparentize} from 'polished';
import {withTheme} from '@material-ui/core/styles';

const DiffCell = withTheme()(
  styled(TableCell)(({theme}) => ({
    borderColor: transparentize(0.78, theme.palette.primary.light),
    backgroundColor: transparentize(0.9, theme.palette.primary.main)
  }))
);

export function FinancialHeaders() {
  return (
    <Fragment>
      <TableCell align="right">Player value</TableCell>
      <TableCell align="right">Cash</TableCell>
      <TableCell align="right" padding="checkbox">
        Total value
      </TableCell>
      <DiffCell align="right" padding="checkbox">
        Gain/loss
      </DiffCell>
    </Fragment>
  );
}

export default function FinancialCells(props) {
  return (
    <Fragment>
      <TableCell align="right">{formatMoney(props.playerValue)}</TableCell>
      <TableCell align="right">{formatMoney(props.cash)}</TableCell>
      <TableCell align="right" padding="checkbox">
        {formatMoney(props.totalValue)}
      </TableCell>
      <DiffCell align="right" padding="checkbox">
        <Diff value={props.diff} />
      </DiffCell>
    </Fragment>
  );
}

FinancialCells.propTypes = {
  playerValue: PropTypes.number.isRequired,
  cash: PropTypes.number.isRequired,
  totalValue: PropTypes.number.isRequired,
  diff: PropTypes.number.isRequired
};
