import CheckoutButton from './checkout-button';
import Footer from './footer';
import Grid from '@material-ui/core/Grid';
import Header from './header';
import Helmet from 'react-helmet';
import Layout from './layout';
import PlayerCard from './player-card';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Region from './region';
import getPlayerCost from '../utils/get-player-cost';
import styled from '@emotion/styled';
import withUser from './with-user';
import {TEAM_SIZE, TOTAL_BUDGET} from '../utils/constants';
import {cover} from 'polished';
import {withTheme} from '@material-ui/core/styles';

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

class TeamBuilder extends Component {
  static propTypes = {
    players: PropTypes.array.isRequired,
    regions: PropTypes.array.isRequired
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
    const selectedPlayers = this.props.players
      .filter(this.isPlayerSelected)
      .sort((a, b) => this.getSelectedIndex(a) - this.getSelectedIndex(b));

    let filteredPlayers = this.props.players;
    if (this.state.region) {
      const region = this.props.regions.find(
        ({code}) => code === this.state.region
      );

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
            {this.props.regions.map(region => (
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

// withUser is needed for user updates to bubble all the way down to the header
export default withUser(TeamBuilder);
