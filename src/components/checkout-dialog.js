import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MoneyRow from './money-row';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {TOTAL_BUDGET} from '../utils/constants';

export default function CheckoutDialog(props) {
  const totalCost = props.players.reduce((acc, player) => acc + player.cost, 0);
  return (
    <Fragment>
      <DialogTitle>Finalize your team</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>blah blah</DialogContentText>
        <Table padding="none">
          <TableHead>
            <TableRow>
              <TableCell>Player name</TableCell>
              <TableCell align="right">Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.players.map(player => (
              <TableRow key={player.id}>
                <TableCell>{player.ign}</TableCell>
                <TableCell align="right">
                  ${player.cost.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            <MoneyRow label="Total" value={totalCost} />
            <MoneyRow label="Remainder" value={TOTAL_BUDGET - totalCost} />
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Go back</Button>
        <Button color="primary">Save team</Button>
      </DialogActions>
    </Fragment>
  );
}

CheckoutDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired
};
