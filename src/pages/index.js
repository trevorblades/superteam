import Grid from '@material-ui/core/Grid';
import Layout from '../components/layout';
import Paper from '@material-ui/core/Paper';
import PlayerCard from '../components/player-card';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import {graphql} from 'gatsby';

const Container = styled.div({
  padding: 40
});

const Footer = styled(Paper)({
  padding: 12,
  position: 'sticky',
  bottom: 0
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

    return (
      <Layout>
        <Container>
          <Grid container spacing={24}>
            {players.map(player => {
              const isSelected = this.state.selectedPlayers.includes(player);
              return (
                <Grid item key={player.id} xs={3}>
                  <PlayerCard
                    disabled={
                      !isSelected &&
                      this.state.selectedPlayers.length >= MAX_TEAM_SIZE
                    }
                    player={player}
                    onClick={this.onPlayerClick}
                    selected={isSelected}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
        <Footer component="footer" square>
          {this.state.selectedPlayers.map(player => (
            <div key={player.id}>
              <Typography>{player.ign}</Typography>
            </div>
          ))}
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
