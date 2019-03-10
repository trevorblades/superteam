import PropTypes from 'prop-types';
import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import mapProps from 'recompose/mapProps';

export const MoneyCell = mapProps(props => ({
  align: 'right',
  children: `$${props.value.toLocaleString()}`
}))(TableCell);

export default function MoneyRow(props) {
  return (
    <TableRow>
      <TableCell align="right">
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
