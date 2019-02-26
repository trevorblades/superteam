import Grid from '@material-ui/core/Grid';
import Layout from '../components/layout';
import Paper from '@material-ui/core/Paper';
import PlayerCard, {CARD_ASPECT_RATIO} from '../components/player-card';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from '@emotion/styled';
import theme from '@trevorblades/mui-theme';
import {TEAM_SIZE} from '../util';
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
  border: props.empty ? `1px solid ${theme.palette.grey[200]}` : 'none',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  ':not(:last-child)': {
    marginRight: 12
  }
}));

const emptySlots = Array(TEAM_SIZE).fill(null);

export default class App extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  state = {
    selectedPlayers: []
  };

  onPlayerCardClick = player => {
    this.setState(prevState => ({
      selectedPlayers: prevState.selectedPlayers.includes(player)
        ? prevState.selectedPlayers.filter(
            selectedPlayer => selectedPlayer !== player
          )
        : [...prevState.selectedPlayers, player]
    }));
  };

  isPlayerSelected = player => this.getSelectedIndex(player) > -1;

  getSelectedIndex = player => this.state.selectedPlayers.indexOf(player.id);

  render() {
    const {playerRanking} = this.props.data.hltv;
    const ratings = playerRanking.map(player => player.rating);
    const minRating = Math.min(...ratings);
    const maxRating = Math.max(...ratings);
    const delta = maxRating - minRating;
    return (
      <Layout>
        <Container>
          <Grid container spacing={40}>
            {playerRanking.map(({player, rating}) => {
              const isSelected = this.isPlayerSelected(player);
              return (
                <Grid item key={player.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <PlayerCard
                    disabled={
                      !isSelected &&
                      this.state.selectedPlayers.length >= TEAM_SIZE
                    }
                    player={player}
                    rating={rating}
                    minRating={minRating}
                    delta={delta}
                    onClick={this.onPlayerCardClick}
                    selected={isSelected}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
        <Footer component="footer" square elevation={10}>
          <Slots>
            {playerRanking
              .filter(({player}) => this.isPlayerSelected(player))
              .sort(
                (a, b) =>
                  this.getSelectedIndex(a.player) -
                  this.getSelectedIndex(b.player)
              )
              .concat(emptySlots)
              .slice(0, TEAM_SIZE)
              .map((playerRanking, index) => {
                if (playerRanking) {
                  const {player, rating} = playerRanking;
                  return (
                    <Slot key={player.id}>
                      <PlayerCard
                        selected
                        mini
                        onClick={this.onPlayerCardClick}
                        player={player}
                        rating={rating}
                        minRating={minRating}
                        delta={delta}
                      />
                    </Slot>
                  );
                }

                return <Slot key={index} empty />;
              })}
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
