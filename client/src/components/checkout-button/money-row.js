import PropTypes from 'prop-types';
import React from 'react';
import {TableCell, TableRow} from '@material-ui/core';
import {formatMoney} from '../../utils/format';
import {mapProps} from 'recompose';

export const MoneyCell = mapProps(props => ({
  align: 'right',
  children: formatMoney(props.value)
}))(TableCell);

export default function MoneyRow(props) {
  return (
    <TableRow>
      <TableCell align="right" padding="default">
        <strong>{props.label}</strong>
      </TableCell>
      <MoneyCell value={props.value} />
    </TableRow>
  );
}

MoneyRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};
