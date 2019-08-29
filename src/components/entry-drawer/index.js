import Diff from '../diff';
import EntryChart from './entry-chart';
import LoadingIndicator from '../loading-indicator';
import PlayerAvatar from '../player-avatar';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import TransactionList from './transaction-list';
import getEntryFinancials, {
  getEntryPlayers
} from '../../utils/get-entry-financials';
import getPlayerCost, {getPlayerCostAtWeek} from '../../utils/get-player-cost';
import styled from '@emotion/styled';
import {
  CardContent,
  CardHeader,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
  withStyles,
  withTheme
} from '@material-ui/core';
import {GET_ENTRY} from '../../utils/queries';
import {Link, navigate} from 'gatsby';
import {MdEdit} from 'react-icons/md';
import {Query} from '@apollo/react-components';
import {formatDate, formatMoney} from '../../utils/format';
import {getISOWeek, getISOWeekYear} from 'date-fns';

const StyledDrawer = withStyles({
  paper: {
    width: 400
  }
})(Drawer);

const Container = styled.div({
  padding: 8
});

const StyledLoadingIndicator = styled(LoadingIndicator)({
  margin: 'auto'
});

const CreatedAt = withTheme(
  styled.span(({theme}) => ({
    fontWeight: 700,
    color: theme.palette.primary.main
  }))
);

const StyledListItemText = styled(ListItemText)({
  paddingRight: 0
});

const SecondaryText = styled.span({
  display: 'flex'
});

const PlayerValue = styled.span({
  marginLeft: 'auto'
});

export default class EntryDrawer extends Component {
  static propTypes = {
    match: PropTypes.array
  };

  static getDerivedStateFromProps(props) {
    // we do this so the drawer content doesn't change when it transitions out
    if (props.match) {
      return {
        id: props.match[1]
      };
    }

    return null;
  }

  state = {
    id: null
  };

  render() {
    return (
      <StyledDrawer
        anchor="right"
        open={Boolean(this.props.match)}
        onClose={() => navigate('/teams')}
      >
        <Query
          query={GET_ENTRY}
          variables={{
            id: this.state.id
          }}
        >
          {({data, loading, error}) => {
            if (loading) {
              return <StyledLoadingIndicator />;
            } else if (error) {
              return (
                <Container>
                  <Typography color="error">{error.message}</Typography>
                </Container>
              );
            }

            const {
              startDate,
              startWeek,
              startYear,
              transactions
            } = getEntryFinancials(data.entry);
            const players = getEntryPlayers(data.entry);
            return (
              <Container>
                <CardHeader
                  title={data.entry.name}
                  subheader={
                    <span>
                      Created on <CreatedAt>{formatDate(startDate)}</CreatedAt>
                    </span>
                  }
                  action={
                    <Tooltip title="Edit team">
                      <IconButton
                        component={Link}
                        to={`/edit/${data.entry.id}`}
                      >
                        <MdEdit size={24} />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <EntryChart
                  players={players}
                  year={startYear}
                  week={startWeek}
                />
                <List>
                  {players.map(player => {
                    const selectedAt = Number(player.selectedAt);
                    const selectedWeek = getISOWeek(selectedAt);
                    const selectedYear = getISOWeekYear(selectedAt);

                    const currentValue = getPlayerCost(player);
                    const initialValue = getPlayerCostAtWeek(
                      player,
                      selectedWeek,
                      selectedYear
                    );

                    return (
                      <ListItem key={player.id}>
                        <ListItemAvatar>
                          <PlayerAvatar player={player} />
                        </ListItemAvatar>
                        <StyledListItemText
                          secondary={
                            <SecondaryText>
                              {player.name}
                              <PlayerValue>
                                <Diff value={currentValue - initialValue} /> •{' '}
                                {formatMoney(getPlayerCost(player))}
                              </PlayerValue>
                            </SecondaryText>
                          }
                        >
                          {player.ign}
                        </StyledListItemText>
                      </ListItem>
                    );
                  })}
                </List>
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    Transaction history
                  </Typography>
                  <TransactionList transactions={transactions} />
                </CardContent>
              </Container>
            );
          }}
        </Query>
      </StyledDrawer>
    );
  }
}
