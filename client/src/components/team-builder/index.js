import PlayerCard from '../player-card';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Region from './region';
import TeamFooter from './team-footer';
import getPlayerCost from '../../utils/get-player-cost';
import styled from '@emotion/styled';
import {GRID_SPACING, TEAM_SIZE, TOTAL_BUDGET} from '../../utils/constants';
import {
  Grid,
  Hidden,
  MenuItem,
  Select,
  withStyles,
  withTheme
} from '@material-ui/core';
import {PageWrapper} from '../common';
import {StaticQuery, graphql} from 'gatsby';

const halfGridSpacing = GRID_SPACING / 2;
const GridWrapper = styled.div({
  padding: GRID_SPACING
});

const Subheader = withTheme(
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
      margin: `${halfGridSpacing}px 0 ${-halfGridSpacing}px`,
      padding: `${halfGridSpacing}px ${GRID_SPACING}px`,
      position: 'sticky',
      backgroundColor: theme.palette.background.default,
      top: minHeight,
      zIndex: 1,
      ...styles
    };
  })
);

const StyledPageWrapper = styled(PageWrapper)({
  display: 'flex'
});

const Regions = styled.nav({
  display: 'flex',
  height: '100%'
});

const StyledSelect = withStyles(theme => ({
  select: {
    ...theme.typography.h6,
    paddingTop: 0,
    paddingBottom: 0
  }
}))(
  styled(Select)({
    height: '100%'
  })
);

const Actions = styled.div({
  marginLeft: 'auto'
});

export default class TeamBuilder extends Component {
  static propTypes = {
    budget: PropTypes.number,
    amountSpent: PropTypes.number,
    selectedPlayers: PropTypes.array,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    budget: TOTAL_BUDGET,
    amountSpent: 0,
    selectedPlayers: []
  };

  constructor(props) {
    super(props);
    this.state = {
      amountSpent: props.amountSpent,
      selectedPlayers: props.selectedPlayers,
      region: ''
    };
  }

  onRegionChange = event => {
    this.selectRegion(event.target.value);
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

  selectRegion = region => {
    this.setState({region});
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
                ...PlayerFragment
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

          return (
            <Fragment>
              <Subheader>
                <StyledPageWrapper>
                  <Hidden smDown implementation="css">
                    <Regions>
                      <Region
                        selected={!this.state.region}
                        value=""
                        onClick={this.selectRegion}
                      >
                        All regions
                      </Region>
                      {regions.map(region => (
                        <Region
                          key={region.code}
                          selected={this.state.region === region.code}
                          value={region.code}
                          onClick={this.selectRegion}
                        >
                          {region.name}
                        </Region>
                      ))}
                    </Regions>
                  </Hidden>
                  <Hidden mdUp implementation="css">
                    <StyledSelect
                      displayEmpty
                      value={this.state.region}
                      onChange={this.onRegionChange}
                    >
                      <MenuItem value="">All regions</MenuItem>
                      {regions.map(region => (
                        <MenuItem key={region.code} value={region.code}>
                          {region.name}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </Hidden>
                  <Actions>{this.props.children(selectedPlayers)}</Actions>
                </StyledPageWrapper>
              </Subheader>
              <GridWrapper>
                <PageWrapper>
                  {/* TODO: consider using a spacing unit for GRID_SPACING */}
                  <Grid container spacing={GRID_SPACING / 8}>
                    {filteredPlayers.map(player => {
                      const isSelected = this.isPlayerSelected(player);
                      return (
                        <Grid item key={player.id} xs={12} sm={6} md={4} lg={3}>
                          <PlayerCard
                            disabled={
                              !isSelected &&
                              (selectedPlayers.length >= TEAM_SIZE ||
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
                </PageWrapper>
              </GridWrapper>
              <TeamFooter
                budget={this.props.budget}
                amountSpent={this.state.amountSpent}
                onPlayerCardClick={this.onPlayerCardClick}
                players={selectedPlayers}
              />
            </Fragment>
          );
        }}
      />
    );
  }
}