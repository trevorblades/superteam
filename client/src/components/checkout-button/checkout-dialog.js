import LoginButton from '../login-button';
import MoneyRow, {MoneyCell} from './money-row';
import PlayerAvatar from '../player-avatar';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import SaveButton from '../save-button';
import getPlayerCost from '../../utils/get-player-cost';
import styled from '@emotion/styled';
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import {CREATE_ENTRY, LIST_ENTRIES} from '../../utils/queries';
import {FaChevronLeft} from 'react-icons/fa';
import {Mutation} from '@apollo/react-components';
import {TOTAL_BUDGET} from '../../utils/constants';
import {navigate} from 'gatsby';
import {sum} from '../../utils/get-entry-financials';
import {withUser} from '../with-user';

const PlayerCell = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 48,
  overflow: 'hidden'
});

const PlayerName = styled.span({
  marginLeft: 12
});

function updateEntries(cache, {data}) {
  try {
    const {entries} = cache.readQuery({query: LIST_ENTRIES});
    cache.writeQuery({
      query: LIST_ENTRIES,
      data: {
        entries: [data.createEntry, ...entries]
      }
    });
  } catch (error) {
    // nothing happens
  }
}

class CheckoutDialog extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    players: PropTypes.array.isRequired,
    user: PropTypes.object
  };

  state = {
    accepted: false
  };

  onAcceptedChange = event => {
    this.setState({
      accepted: event.target.checked
    });
  };

  render() {
    const totalCost = this.props.players.map(getPlayerCost).reduce(sum);
    return (
      <Mutation
        mutation={CREATE_ENTRY}
        variables={{
          playerIds: this.props.players.map(player => player.id)
        }}
        onCompleted={data => navigate(`/teams/${data.createEntry.id}`)}
        update={updateEntries}
      >
        {(createTeam, {loading, error}) => (
          <form
            onSubmit={event => {
              event.preventDefault();

              // don't send the request if nobody is logged in
              if (this.props.user) {
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
                That&apos;s a nice looking team! Now give it a name, agree to
                the terms, and save it to enter the contest.
              </DialogContentText>
              <TextField
                required
                fullWidth
                autoFocus
                disabled={loading}
                spellCheck={false}
                autoComplete="off"
                margin="normal"
                label="Your team name"
                variant="outlined"
                name="name"
                error={Boolean(error)}
                helperText={error && error.message}
              />
              <Table padding="none">
                <TableHead>
                  <TableRow>
                    <TableCell padding="default" style={{paddingLeft: 0}}>
                      Player name
                    </TableCell>
                    <TableCell align="right">Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.players.map(player => (
                    <TableRow key={player.id}>
                      <TableCell>
                        <PlayerCell>
                          <PlayerAvatar player={player} size={32} />
                          <PlayerName>{player.ign}</PlayerName>
                        </PlayerCell>
                      </TableCell>
                      <MoneyCell value={getPlayerCost(player)} />
                    </TableRow>
                  ))}
                  <MoneyRow label="Total" value={totalCost} />
                  <MoneyRow
                    label="Leftover cash"
                    value={TOTAL_BUDGET - totalCost}
                  />
                </TableBody>
              </Table>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={this.state.accepted}
                    onChange={this.onAcceptedChange}
                  />
                }
                label={
                  <Typography variant="body2">
                    I have read and agree with the{' '}
                    <a href="/rules" target="_blank" rel="noopener noreferrer">
                      official contest rules
                    </a>
                    .
                  </Typography>
                }
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.props.onClose}
                style={{marginRight: 'auto'}}
              >
                <FaChevronLeft style={{marginRight: 8}} />
                Go back
              </Button>
              {/*
              componentize login/save buttons to consume injected className prop
              more info: https://bit.ly/2SJyiXD
            */}
              {this.props.user ? (
                <SaveButton
                  disabled={!this.state.accepted || loading}
                  type="submit"
                />
              ) : (
                <LoginButton variant="outlined" text="Log in to save" />
              )}
            </DialogActions>
          </form>
        )}
      </Mutation>
    );
  }
}

export default withUser(CheckoutDialog);