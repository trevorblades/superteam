import CheckoutButton from './checkout-button';
import Grid from '@material-ui/core/Grid';
import Header from '../header';
import PlayerCard from './player-card';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Region from './region';
import TeamFooter from './team-footer';
import getPlayerCost from '../../utils/get-player-cost';
import styled from '@emotion/styled';
import withUser from '../with-user';
import {StaticQuery, graphql} from 'gatsby';
import {TEAM_SIZE, TOTAL_BUDGET} from '../../utils/constants';
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

class TeamBuilderInner extends Component {
  static propTypes = {
    budget: PropTypes.number,
    amountSpent: PropTypes.number,
    selectedPlayers: PropTypes.array
  };

  static defaultProps = {
    budget: TOTAL_BUDGET,
    amountSpent: 0,
    selectedPlayers: []
  };

  constructor(props) {
    super(props);
    this.state = {
      region: null,
      amountSpent: props.amountSpent,
      selectedPlayers: props.selectedPlayers
    };
  }

  onRegionClick = region => {
    this.setState({region});
  };

  onPlayerCardClick = player => {
    const cost = getPlayerCost(player);
    this.setState(prevState => {
      const wasSelected = prevState.selectedPlayers.includes(player.id);
      return {
        amountSpent: prevState.amountSpent + cost * (wasSelected ? -1 : 1),
        selectedPlayers: wasSelected
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
    return (
      <StaticQuery
        query={graphql`
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
        `}
        render={data => {
          const {players} = data.superteam;
          const countries = Array.from(
            new Set(players.map(player => player.country))
          );
          const regions = data.countries.regions.filter(region =>
            region.countries.some(country => countries.includes(country.code))
          );

          const selectedPlayers = players
            .filter(this.isPlayerSelected)
            .sort(
              (a, b) => this.getSelectedIndex(a) - this.getSelectedIndex(b)
            );

          let filteredPlayers = players;
          if (this.state.region) {
            const region = regions.find(({code}) => code === this.state.region);

            filteredPlayers = filteredPlayers.filter(player =>
              region.countries.some(country => country.code === player.country)
            );
          }

          const isTeamFull = this.state.selectedPlayers.length >= TEAM_SIZE;
          return (
            <Fragment>
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
                                this.props.budget - this.state.amountSpent <
                                  getPlayerCost(player))
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
                <TeamFooter
                  budget={this.props.budget}
                  amountSpent={this.state.amountSpent}
                  onPlayerCardClick={this.onPlayerCardClick}
                  players={selectedPlayers}
                />
              </Container>
            </Fragment>
          );
        }}
      />
    );
  }
}

// withUser is needed for user updates to bubble all the way down to the header
export default withUser(TeamBuilderInner);
