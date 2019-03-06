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
import TwitterLogin from './twitter-login';
import styled from '@emotion/styled';
import {FaChevronLeft, FaTwitter} from 'react-icons/fa';
import {TOTAL_BUDGET} from '../utils/constants';
import {withTheme} from '@material-ui/core/styles';

const TwitterButton = withTheme()(
  styled(Button)(({theme}) => {
    const {main, dark} = theme.palette.augmentColor({main: '#38a1f3'});
    return {
      color: 'white',
      backgroundColor: main,
      ':hover': {
        backgroundColor: dark
      }
    };
  })
);

export default function CheckoutDialog(props) {
  const totalCost = props.players.reduce((acc, player) => acc + player.cost, 0);
  return (
    <Fragment>
      <DialogTitle>Finalize your team</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          Here&apos;s your team! If this looks right to you, sign in with
          Twitter and hit &quot;save&quot;.
        </DialogContentText>
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
      <TwitterLogin>
        {({pending, startAuth}) => (
          <DialogActions>
            <Button onClick={props.onClose} style={{marginRight: 'auto'}}>
              <FaChevronLeft style={{marginRight: 8}} />
              Go back
            </Button>
            <TwitterButton
              variant="contained"
              disabled={pending}
              onClick={startAuth}
            >
              <FaTwitter size={20} style={{marginRight: 8}} />
              Log in with Twitter
            </TwitterButton>
          </DialogActions>
        )}
      </TwitterLogin>
    </Fragment>
  );
}

CheckoutDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired
};
