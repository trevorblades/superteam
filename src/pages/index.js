import Grid from '@material-ui/core/Grid';
import Layout from '../components/layout';
import Paper from '@material-ui/core/Paper';
import PlayerCard, {CARD_ASPECT_RATIO} from '../components/player-card';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from '@emotion/styled';
import theme from '@trevorblades/mui-theme';
import {graphql} from 'gatsby';

const Container = styled.div({
  padding: 40
});

const Footer = styled(Paper)({
  padding: 16,
  position: 'sticky',
  bottom: 0
});

const Slots = styled.div({
  display: 'flex'
});

const slotWidth = 90;
const Slot = styled.div(props => ({
  width: slotWidth,
  height: slotWidth / CARD_ASPECT_RATIO,
  border: props.empty ? `1px solid ${theme.palette.grey[100]}` : 'none',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  ':not(:last-child)': {
    marginRight: 12
  }
}));

const MAX_TEAM_SIZE = 5;

export default class App extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  state = {
    selectedPlayers: []
  };

  onPlayerClick = player => {
    this.setState(prevState => ({
      selectedPlayers: prevState.selectedPlayers.includes(player)
        ? prevState.selectedPlayers.filter(
            selectedPlayer => selectedPlayer.id !== player.id
          )
        : [...prevState.selectedPlayers, player]
    }));
  };

  render() {
    const {playerRanking: players} = this.props.data.hltv;
    const ratings = players.map(player => player.rating);
    const maxRating = Math.max(...ratings);
    const minRating = Math.min(...ratings);
    const range = maxRating - minRating;

    return (
      <Layout>
        <Container>
          <Grid container spacing={40}>
            {players.map(({player, rating}) => {
              const isSelected = this.state.selectedPlayers.includes(player);
              return (
                <Grid item key={player.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <PlayerCard
                    disabled={
                      !isSelected &&
                      this.state.selectedPlayers.length >= MAX_TEAM_SIZE
                    }
                    player={player}
                    rating={rating}
                    onClick={this.onPlayerClick}
                    selected={isSelected}
                    range={range}
                    minRating={minRating}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
        <Footer component="footer" square elevation={10}>
          <Slots>
            {this.state.selectedPlayers
              .concat(Array(MAX_TEAM_SIZE).fill(null))
              .slice(0, MAX_TEAM_SIZE)
              .map((player, index) => (
                <Slot key={player ? player.id : index} empty={!player}>
                  {player && (
                    <PlayerCard
                      selected
                      mini
                      onClick={this.onPlayerClick}
                      player={player}
                      range={range}
                      minRating={minRating}
                    />
                  )}
                </Slot>
              ))}
          </Slots>
        </Footer>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  {
    hltv {
      playerRanking(
        startDate: "2018-01-01"
        endDate: "2018-12-31"
        matchType: BigEvents
        rankingFilter: Top50
      ) {
        rating
        player {
          id
          ign
          name
          image
          team {
            name
            logo
          }
          country {
            name
            code
          }
          statistics {
            headshots
            kdRatio
            damagePerRound
          }
        }
      }
    }
  }
`;
