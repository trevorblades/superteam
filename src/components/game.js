import Footer from './footer';
import Grid from '@material-ui/core/Grid';
import HeaderItem from './header-item';
import Layout from './layout';
import PlayerCard from './player-card';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from '@emotion/styled';
import theme from '@trevorblades/mui-theme';
import {TEAM_SIZE, TOTAL_BUDGET, getPlayerCardProps} from '../util';
import {cover} from 'polished';

const Container = styled.div(cover(), {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto'
});

const spacing = 40;
const halfSpacing = spacing / 2;
const GridWrapper = styled.div({
  padding: spacing
});

const Header = styled.header({
  display: 'flex',
  flexShrink: 0,
  margin: `${halfSpacing}px 0 ${-halfSpacing}px`,
  padding: `${halfSpacing}px ${spacing}px`,
  position: 'sticky',
  backgroundColor: theme.palette.background.default,
  top: 0,
  zIndex: 1
});

export default class Game extends Component {
  static propTypes = {
    delta: PropTypes.number.isRequired,
    minRating: PropTypes.number.isRequired,
    playerRanking: PropTypes.array.isRequired,
    filteredContinents: PropTypes.array.isRequired,
    regions: PropTypes.object.isRequired
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
    const isTeamFull = this.state.selectedPlayers.length >= TEAM_SIZE;
    return (
      <Layout>
        <Container>
          <Header>
            <HeaderItem
              selected={!this.state.region}
              value={null}
              onClick={this.onRegionClick}
            >
              All players
            </HeaderItem>
            {this.props.filteredContinents.map(continent => (
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
          <GridWrapper>
            <Grid container spacing={spacing}>
              {this.props.playerRanking
                .filter(({player}) => {
                  if (!this.state.region) {
                    return true;
                  }

                  return this.props.regions[this.state.region].includes(
                    player.country.code
                  );
                })
                .map(({player, rating}) => {
                  const isSelected = this.isPlayerSelected(player);
                  const {cost, percentile} = getPlayerCardProps(
                    rating,
                    this.props.minRating,
                    this.props.delta
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
                          !isSelected &&
                          (isTeamFull || this.state.budget < cost)
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
          </GridWrapper>
          <Footer
            budget={this.state.budget}
            onPlayerCardClick={this.onPlayerCardClick}
            minRating={this.props.minRating}
            delta={this.props.delta}
            selectedPlayers={this.props.playerRanking
              .filter(({player}) => this.isPlayerSelected(player))
              .sort(
                (a, b) =>
                  this.getSelectedIndex(a.player) -
                  this.getSelectedIndex(b.player)
              )}
          />
        </Container>
      </Layout>
    );
  }
}
