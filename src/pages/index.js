import Grid from '@material-ui/core/Grid';
import Layout from '../components/layout';
import Paper from '@material-ui/core/Paper';
import PlayerCard, {CARD_ASPECT_RATIO} from '../components/player-card';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from '@emotion/styled';
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
const Slot = styled.div({
  width: slotWidth,
  height: slotWidth / CARD_ASPECT_RATIO,
  ':not(:last-child)': {
    marginRight: 12
  }
});

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
    const players = this.props.data.hltv.teamRankings.flatMap(
      teamRanking => teamRanking.team.players
    );

    players.sort((a, b) => b.statistics.rating - a.statistics.rating);

    const playerRatings = players.map(player => player.statistics.rating);
    const maxRating = Math.max(...playerRatings);
    const minRating = Math.min(...playerRatings);
    const range = maxRating - minRating;

    return (
      <Layout>
        <Container>
          <Grid container spacing={40}>
            {players.map(player => {
              const isSelected = this.state.selectedPlayers.includes(player);
              return (
                <Grid item key={player.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <PlayerCard
                    disabled={
                      !isSelected &&
                      this.state.selectedPlayers.length >= MAX_TEAM_SIZE
                    }
                    player={player}
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
        <Footer component="footer" square>
          <Slots>
            {this.state.selectedPlayers
              .concat(Array(MAX_TEAM_SIZE).fill(null))
              .slice(0, MAX_TEAM_SIZE)
              .map((player, index) => (
                <Slot key={player ? player.id : index}>
                  {player ? (
                    <PlayerCard
                      selected
                      mini
                      onClick={this.onPlayerClick}
                      player={player}
                      range={range}
                      minRating={minRating}
                    />
                  ) : null}
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
      teamRankings(limit: 10) {
        team {
          players {
            id
            name
            ign
            image
            team {
              name
              logo
            }
            statistics {
              rating
              kdRatio
              kills
              headshots
              damagePerRound
            }
            country {
              name
              code
            }
          }
        }
      }
    }
  }
`;
