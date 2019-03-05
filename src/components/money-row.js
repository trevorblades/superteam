import PropTypes from 'prop-types';
import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export default function MoneyRow(props) {
  return (
    <TableRow>
      <TableCell align="right">
        <strong>{props.label}</strong>
      </TableCell>
      <TableCell align="right">${props.value.toLocaleString()}</TableCell>
    </TableRow>
  );
}

MoneyRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};
