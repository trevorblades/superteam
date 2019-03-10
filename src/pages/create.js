import CheckoutButton from '../components/checkout-button';
import Footer from '../components/footer';
import Grid from '@material-ui/core/Grid';
import Header from '../components/header';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import PlayerCard from '../components/player-card';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Region from '../components/region';
import getPlayerCost from '../utils/get-player-cost';
import styled from '@emotion/styled';
import {TEAM_SIZE, TOTAL_BUDGET} from '../utils/constants';
import {cover} from 'polished';
import {graphql} from 'gatsby';
import {withTheme} from '@material-ui/core/styles';
// import withUser from './with-user';

const Container = styled.div(cover(), {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto'
});

const gridSpacing = 40;
const halfGridSpacing = gridSpacing / 2;
const GridWrapper = styled.div({
  padding: gridSpacing
});

const Regions = withTheme()(
  styled.header(({theme}) => {
    const {minHeight, ...toolbar} = theme.mixins.toolbar;
    const styles = Object.keys(toolbar).reduce((acc, key) => {
      const {minHeight} = toolbar[key];
      return {
        ...acc,
        [key]: {
          top: minHeight
        }
      };
    }, {});

    return {
      display: 'flex',
      flexShrink: 0,
      margin: `${halfGridSpacing}px 0 ${-halfGridSpacing}px`,
      padding: `${halfGridSpacing}px ${gridSpacing}px`,
      position: 'sticky',
      backgroundColor: theme.palette.background.default,
      top: minHeight,
      zIndex: 1,
      ...styles
    };
  })
);

export default class Create extends Component {
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

  onPlayerCardClick = player => {
    const cost = getPlayerCost(player);
    this.setState(prevState => {
      const isSelected = prevState.selectedPlayers.includes(player.id);
      return {
        budget: prevState.budget + cost * (isSelected ? 1 : -1),
        selectedPlayers: isSelected
          ? prevState.selectedPlayers.filter(
              selectedPlayer => selectedPlayer !== player.id
            )
          : [...prevState.selectedPlayers, player.id]
      };
    });
  };

  isPlayerSelected = player => this.getSelectedIndex(player) > -1;

  getSelectedIndex(player) {
    return this.state.selectedPlayers.indexOf(player.id);
  }

  render() {
    const {players} = this.props.data.superteam;
    const selectedPlayers = players
      .filter(this.isPlayerSelected)
      .sort((a, b) => this.getSelectedIndex(a) - this.getSelectedIndex(b));

    let filteredPlayers = players;
    const {regions} = this.props.data.countries;
    if (this.state.region) {
      const region = regions.find(({code}) => code === this.state.region);
      filteredPlayers = filteredPlayers.filter(player =>
        region.countries.some(country => country.code === player.country)
      );
    }

    const isTeamFull = this.state.selectedPlayers.length >= TEAM_SIZE;
    return (
      <Layout>
        <Helmet>
          <title>Create a team</title>
        </Helmet>
        <Container>
          <Header>
            <CheckoutButton players={selectedPlayers} />
          </Header>
          <Regions>
            <Region
              selected={!this.state.region}
              value={null}
              onClick={this.onRegionClick}
            >
              All players
            </Region>
            {regions.map(region => (
              <Region
                key={region.code}
                selected={this.state.region === region.code}
                value={region.code}
                onClick={this.onRegionClick}
              >
                {region.name}
              </Region>
            ))}
          </Regions>
          <GridWrapper>
            <Grid container spacing={gridSpacing}>
              {filteredPlayers.map(player => {
                const isSelected = this.isPlayerSelected(player);
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
                        !isSelected &&
                        (isTeamFull ||
                          this.state.budget < getPlayerCost(player))
                      }
                      player={player}
                      onClick={this.onPlayerCardClick}
                      selected={isSelected}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </GridWrapper>
          <Footer
            budget={this.state.budget}
            onPlayerCardClick={this.onPlayerCardClick}
            players={selectedPlayers}
          />
        </Container>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  {
    countries {
      regions: continents {
        code
        name
        countries {
          code
        }
      }
    }
    superteam {
      players {
        id
        name
        ign
        image
        country
        team {
          id
          name
          logo
        }
        statistics {
          id
          rating
          percentile
          kdRatio
          damagePerRound
          headshots
          week
          year
        }
      }
    }
  }
`;

// withUser is needed for user updates to bubble all the way down to the header
// export default withUser(TeamBuilder);
