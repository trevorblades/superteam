import Footer from '../components/footer';
import Grid from '@material-ui/core/Grid';
import Layout from '../components/layout';
import PlayerCard from '../components/player-card';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import theme from '@trevorblades/mui-theme';
import withProps from 'recompose/withProps';
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

const HeaderItem = withProps({
  component: 'button',
  variant: 'h5'
})(
  styled(Typography)({
    padding: 0,
    border: 'none',
    outline: 'none',
    background: 'none',
    ':not([disabled])': {
      cursor: 'pointer',
      transition: 'opacity 100ms ease-in-out',
      ':hover': {
        opacity: 0.7
      }
    },
    ':not(:last-child)': {
      marginRight: theme.spacing.unit * 4
    }
  })
);

const REGION_ALL = 'ALL';
const REGION_NA = 'NA';
const REGION_EU = 'EU';
const REGION_AS = 'AS';
const regions = {
  [REGION_ALL]: 'All players',
  [REGION_NA]: 'North America',
  [REGION_EU]: 'Europe',
  [REGION_AS]: 'Asia'
};

export default class App extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  state = {
    budget: TOTAL_BUDGET,
    region: REGION_ALL,
    selectedPlayers: []
  };

  onRegionClick(region) {
    this.setState({region});
  }

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
        <Header>
          {Object.keys(regions).map(key => {
            const isSelected = this.state.region === key;
            return (
              <HeaderItem
                key={key}
                disabled={isSelected}
                color={isSelected ? 'default' : 'textSecondary'}
                onClick={() => this.onRegionClick(key)}
              >
                {regions[key]}
              </HeaderItem>
            );
          })}
        </Header>
        <Container>
          <Grid container spacing={spacing}>
            {playerRanking
              .filter(({player}) => {
                if (this.state.region === REGION_ALL) {
                  return true;
                }

                switch (this.state.region) {
                  case REGION_EU:
                    return player.country.code === 'US';
                  default:
                    return false;
                }
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
