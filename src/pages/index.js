import Footer from '../components/footer';
import Grid from '@material-ui/core/Grid';
import HeaderItem from '../components/header-item';
import Layout from '../components/layout';
import PlayerCard from '../components/player-card';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from '@emotion/styled';
import theme from '@trevorblades/mui-theme';
import {TEAM_SIZE, TOTAL_BUDGET, getPlayerCardProps} from '../util';
import {graphql} from 'gatsby';

const spacing = 40;
const halfSpacing = spacing / 2;
const Container = styled.div({
  padding: spacing
});

const Header = styled.header({
  display: 'flex',
  margin: `${halfSpacing}px 0 ${-halfSpacing}px`,
  padding: `${halfSpacing}px ${spacing}px`,
  position: 'sticky',
  backgroundColor: theme.palette.background.default,
  top: 0,
  zIndex: 1
});

export default class App extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  state = {
    budget: TOTAL_BUDGET,
    region: null,
    selectedPlayers: []
  };

  onRegionClick = region => {
    this.setState({region});
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

    const ratings = [];
    const countries = [];
    playerRanking.forEach(({player, rating}) => {
      ratings.push(rating);

      const {code} = player.country;
      if (!countries.includes(code)) {
        countries.push(code);
      }
    });

    const continents = this.props.data.countries.continents.filter(continent =>
      continent.countries.some(country => countries.includes(country.code))
    );

    const regions = continents.reduce(
      (acc, continent) => ({
        ...acc,
        [continent.code]: continent.countries.map(country => country.code)
      }),
      {}
    );

    const minRating = Math.min(...ratings);
    const maxRating = Math.max(...ratings);
    const delta = maxRating - minRating;
    const isTeamFull = this.state.selectedPlayers.length >= TEAM_SIZE;
    return (
      <Layout>
        <Header>
          <HeaderItem
            selected={!this.state.region}
            value={null}
            onClick={this.onRegionClick}
          >
            All players
          </HeaderItem>
          {continents.map(continent => (
            <HeaderItem
              key={continent.code}
              selected={this.state.region === continent.code}
              value={continent.code}
              onClick={this.onRegionClick}
            >
              {continent.name}
            </HeaderItem>
          ))}
        </Header>
        <Container>
          <Grid container spacing={spacing}>
            {playerRanking
              .filter(({player}) => {
                if (!this.state.region) {
                  return true;
                }

                return regions[this.state.region].includes(player.country.code);
              })
              .map(({player, rating}) => {
                const isSelected = this.isPlayerSelected(player);
                const {cost, percentile} = getPlayerCardProps(
                  rating,
                  minRating,
                  delta
                );

                return (
                  <Grid
                    item
                    key={player.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                  >
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
        <Footer
          budget={this.state.budget}
          onPlayerCardClick={this.onPlayerCardClick}
          minRating={minRating}
          delta={delta}
          selectedPlayers={playerRanking
            .filter(({player}) => this.isPlayerSelected(player))
            .sort(
              (a, b) =>
                this.getSelectedIndex(a.player) -
                this.getSelectedIndex(b.player)
            )}
        />
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  {
    countries {
      continents {
        code
        name
        countries {
          code
          name
          emoji
        }
      }
    }
    hltv {
      playerRanking(
        startDate: "2018-01-01"
        endDate: "2018-12-31"
        matchType: Lan
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
