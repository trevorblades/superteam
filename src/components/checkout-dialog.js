import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MoneyRow from './money-row';
import PropTypes from 'prop-types';
import React from 'react';
import SaveButton from './save-button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import gql from 'graphql-tag';
import withUser from './with-user';
import {FaChevronLeft} from 'react-icons/fa';
import {Mutation} from 'react-apollo';
import {TOTAL_BUDGET} from '../utils/constants';

function CheckoutDialog(props) {
  const totalCost = props.players.reduce((acc, player) => acc + player.cost, 0);
  return (
    <Mutation
      mutation={gql`
        mutation CreateTeam($name: String, $playerIds: [String]!) {
          createTeam(name: $name, playerIds: $playerIds) {
            id
            name
            players {
              id
              name
              ign
            }
          }
        }
      `}
      variables={{
        playerIds: props.players.map(player => player.id)
      }}
    >
      {(createTeam, {loading}) => (
        <form
          onSubmit={event => {
            event.preventDefault();

            // don't send the request if nobody is logged in
            if (props.user) {
              createTeam({
                variables: {
                  name: event.target.name.value
                }
              });
            }
          }}
        >
          <DialogTitle>Finalize your team</DialogTitle>
          <DialogContent>
            <DialogContentText gutterBottom>
              That&apos;s a nice looking team! Now give it a name and save it to
              enter the competition.
            </DialogContentText>
            <TextField
              required
              fullWidth
              autoFocus
              spellCheck={false}
              autoComplete="off"
              margin="normal"
              label="Your team name"
              variant="outlined"
              name="name"
            />
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
            <Button onClick={props.onClose} style={{marginRight: 'auto'}}>
              <FaChevronLeft style={{marginRight: 8}} />
              Go back
            </Button>
            {/*
              componentize login/save buttons to consume injected className prop
              more info: https://bit.ly/2SJyiXD
            */}
            <SaveButton user={props.user} disabled={loading} />
          </DialogActions>
        </form>
      )}
    </Mutation>
  );
}

CheckoutDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired,
  user: PropTypes.object
};

export default withUser(CheckoutDialog);
