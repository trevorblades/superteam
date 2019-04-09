import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Diff from '../diff';
import Drawer from '@material-ui/core/Drawer';
import EntryChart from './entry-chart';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import LoadingIndicator from '../loading-indicator';
import PlayerAvatar from '../player-avatar';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import TransactionList from './transaction-list';
import Typography from '@material-ui/core/Typography';
import getEntryFinancials, {
  getEntryPlayers
} from '../../utils/get-entry-financials';
import getISOWeek from 'date-fns/getISOWeek';
import getISOWeekYear from 'date-fns/getISOWeekYear';
import getPlayerCost, {getPlayerCostAtWeek} from '../../utils/get-player-cost';
import styled from '@emotion/styled';
import {GET_ENTRY} from '../../utils/queries';
import {Link, navigate} from 'gatsby';
import {MdEdit} from 'react-icons/md';
import {Query} from 'react-apollo';
import {formatDate, formatMoney} from '../../utils/format';
import {withStyles, withTheme} from '@material-ui/core/styles';

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

const CreatedAt = withTheme()(
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
                  <Typography variant="h6">Transaction history</Typography>
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
