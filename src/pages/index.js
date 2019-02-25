import Grid from '@material-ui/core/Grid';
import Layout from '../components/layout';
import Paper from '@material-ui/core/Paper';
import PlayerCard from '../components/player-card';
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

const SelectedPlayers = styled.div({
  display: 'flex'
});

const selectedPlayerWidth = 72;
const selectedPlayerAspectRatio = 3 / 4;
const SelectedPlayer = styled.div(props => ({
  width: selectedPlayerWidth,
  height: selectedPlayerWidth / selectedPlayerAspectRatio,
  border: props.empty ? `1px dashed ${theme.palette.grey[300]}` : 'none',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: props.empty ? 'transparent' : 'grey',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  ':not(:last-child)': {
    marginRight: 12
  }
}));

const TeamLogo = styled.img({
  width: 16,
  position: 'absolute',
  bottom: 4,
  left: 4
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
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
        <Footer component="footer" square>
          <SelectedPlayers>
            {this.state.selectedPlayers
              .concat(Array(MAX_TEAM_SIZE).fill(null))
              .slice(0, MAX_TEAM_SIZE)
              .map((player, index) =>
                player ? (
                  <SelectedPlayer
                    key={player.id}
                    style={{
                      backgroundImage: `url(${player.image})`
                    }}
                  >
                    <TeamLogo src={player.team.logo} />
                  </SelectedPlayer>
                ) : (
                  <SelectedPlayer key={index} empty />
                )
              )}
          </SelectedPlayers>
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
