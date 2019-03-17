import CardHeader from '@material-ui/core/CardHeader';
import Diff from '../diff';
import Drawer from '@material-ui/core/Drawer';
import EntryChart from './entry-chart';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import LoadingIndicator from '../loading-indicator';
import PlayerAvatar from '../player-avatar';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import formatMoney from '../../utils/format-money';
import getPlayerCost, {getInitialPlayerCost} from '../../utils/get-player-cost';
import styled from '@emotion/styled';
import {GET_ENTRY} from '../../utils/queries';
import {Query} from 'react-apollo';
import {getEntryDate, getEntryPlayers} from '../../utils/get-entry-financials';
import {navigate} from 'gatsby';
import {withStyles} from '@material-ui/core';

const StyledLoadingIndicator = styled(LoadingIndicator)({
  margin: 'auto'
});

const StyledListItemText = styled(ListItemText)({
  paddingRight: 0
});

const SecondaryText = styled.span({
  display: 'flex'
});

const PlayerValue = styled.span({
  marginLeft: 'auto'
});

class EntryDrawer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
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
      <Drawer
        anchor="right"
        open={Boolean(this.props.match)}
        onClose={() => navigate('/teams')}
        classes={{
          paper: this.props.classes.paper
        }}
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
              return <Typography color="error">{error.message}</Typography>;
            }

            const {date, week, year} = getEntryDate(data.entry);
            const players = getEntryPlayers(data.entry);
            return (
              <div>
                <CardHeader
                  title={data.entry.name}
                  subheader={
                    <span>
                      Created{' '}
                      <span className={this.props.classes.createdAt}>
                        {date.toLocaleDateString()}
                      </span>
                    </span>
                  }
                />
                <EntryChart players={players} year={year} week={week} />
                <List>
                  {players.map(player => {
                    const currentValue = getPlayerCost(player);
                    const initialValue = getInitialPlayerCost(
                      week,
                      year,
                      player
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
              </div>
            );
          }}
        </Query>
      </Drawer>
    );
  }
}

export default withStyles(
  theme => ({
    paper: {
      width: 400,
      padding: 8
    },
    createdAt: {
      fontWeight: 'bold',
      color: theme.palette.primary.light
    }
  }),
  {withTheme: true}
)(EntryDrawer);
