import CardHeader from '@material-ui/core/CardHeader';
import Diff from './diff';
import Drawer from '@material-ui/core/Drawer';
import EntryChart from './entry-chart';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import getISOWeek from 'date-fns/getISOWeek';
import getISOWeekYear from 'date-fns/getISOWeekYear';
import getPlayerCost, {getInitialPlayerCost} from '../utils/get-player-cost';
import styled from '@emotion/styled';
import {GET_ENTRY} from '../utils/queries';
import {PlayerAvatar} from './common';
import {Query} from 'react-apollo';
import {navigate} from 'gatsby';

const Container = styled.div({
  width: 400,
  padding: 8
});

export default class EntryDrawer extends Component {
  static propTypes = {
    match: PropTypes.array
  };

  static getDerivedStateFromProps(props) {
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
        onClose={() => navigate('/entries')}
      >
        <Container>
          <Query
            query={GET_ENTRY}
            variables={{
              id: this.state.id
            }}
          >
            {({data, loading, error}) => {
              if (loading) {
                return <Typography>Loading</Typography>;
              } else if (error) {
                return <Typography color="error">{error.message}</Typography>;
              }

              const date = new Date(Number(data.entry.createdAt));
              const week = getISOWeek(date);
              const year = getISOWeekYear(date);
              return (
                <Fragment>
                  <CardHeader
                    title={data.entry.name}
                    subheader={`Created ${date.toLocaleDateString()}`}
                  />
                  <List>
                    {data.entry.players.map(player => {
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
                          <ListItemText secondary={player.name}>
                            {player.ign} (
                            <Diff value={currentValue - initialValue} />)
                          </ListItemText>
                        </ListItem>
                      );
                    })}
                  </List>
                  <EntryChart players={data.entry.players} />
                </Fragment>
              );
            }}
          </Query>
        </Container>
      </Drawer>
    );
  }
}
