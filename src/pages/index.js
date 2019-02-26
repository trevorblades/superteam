import Grid from '@material-ui/core/Grid';
import Layout from '../components/layout';
import Paper from '@material-ui/core/Paper';
import PlayerCard, {CARD_ASPECT_RATIO} from '../components/player-card';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import theme from '@trevorblades/mui-theme';
import {AVERATE_PLAYER_COST, TEAM_SIZE, TOTAL_BUDGET} from '../util';
import {graphql} from 'gatsby';

const Container = styled.div({
  padding: 40
});

const Footer = styled(Paper)({
  display: 'flex',
  alignItems: 'center',
  padding: 16,
  position: 'sticky',
  bottom: 0
});

const Slots = styled.div({
  display: 'flex',
  marginRight: 40
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

function getPlayerCardProps(rating, minRating, delta) {
  const percentile = (rating - minRating) / delta;
  const cost = AVERATE_PLAYER_COST * (percentile + 0.5);
  return {
    percentile,
    cost: Math.round(cost)
  };
}

export default class App extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  state = {
    budget: TOTAL_BUDGET,
    selectedPlayers: []
  };

  onPlayerCardClick = (player, cost) => {
    this.setState(prevState => {
      const isSelected = prevState.selectedPlayers.includes(player);
      return {
        budget: prevState.budget + cost * (isSelected ? 1 : -1),
        selectedPlayers: isSelected
          ? prevState.selectedPlayers.filter(
              selectedPlayer => selectedPlayer !== player
            )
          : [...prevState.selectedPlayers, player]
      };
    });
  };

  isPlayerSelected(player) {
    return this.getSelectedIndex(player) > -1;
  }

  getSelectedIndex(player) {
    return this.state.selectedPlayers.indexOf(player.id);
  }

  render() {
    const {playerRanking} = this.props.data.hltv;
    const ratings = playerRanking.map(player => player.rating);
    const minRating = Math.min(...ratings);
    const maxRating = Math.max(...ratings);
    const delta = maxRating - minRating;
    const isTeamFull = this.state.selectedPlayers.length >= TEAM_SIZE;
    return (
      <Layout>
        <Container>
          <Grid container spacing={40}>
            {playerRanking.map(({player, rating}) => {
              const isSelected = this.isPlayerSelected(player);
              const {cost, percentile} = getPlayerCardProps(
                rating,
                minRating,
                delta
              );

              return (
                <Grid item key={player.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <PlayerCard
                    disabled={
                      !isSelected && (isTeamFull || this.state.budget < cost)
                    }
                    player={player}
                    percentile={percentile}
                    cost={cost}
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
                  const {cost, percentile} = getPlayerCardProps(
                    rating,
                    minRating,
                    delta
                  );

                  return (
                    <Slot key={player.id}>
                      <PlayerCard
                        selected
                        mini
                        percentile={percentile}
                        cost={cost}
                        onClick={this.onPlayerCardClick}
                        player={player}
                      />
                    </Slot>
                  );
                }

                return <Slot key={index} empty />;
              })}
          </Slots>
          <div>
            <Typography>Remaining budget</Typography>
            <Typography variant="h4">
              ${this.state.budget.toLocaleString()}
            </Typography>
          </div>
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
