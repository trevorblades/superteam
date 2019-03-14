import Grid from '@material-ui/core/Grid';
import PlayerCard from './player-card';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Region from './region';
import TeamFooter from './team-footer';
import getPlayerCost from '../../utils/get-player-cost';
import styled from '@emotion/styled';
import withUser from '../with-user';
import {TEAM_SIZE, TOTAL_BUDGET} from '../../utils/constants';
import {withTheme} from '@material-ui/core/styles';

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
    budget: PropTypes.number,
    players: PropTypes.array.isRequired,
    regions: PropTypes.array.isRequired,
    amountSpent: PropTypes.number.isRequired,
    selectedPlayers: PropTypes.array.isRequired,
    onPlayerCardClick: PropTypes.func.isRequired,
    isPlayerSelected: PropTypes.func.isRequired
  };

  static defaultProps = {
    budget: TOTAL_BUDGET
  };

  state = {
    region: null
  };

  onRegionClick = region => {
    this.setState({region});
  };

  render() {
    let filteredPlayers = this.props.players;
    if (this.state.region) {
      const region = this.props.regions.find(
        ({code}) => code === this.state.region
      );

      filteredPlayers = filteredPlayers.filter(player =>
        region.countries.some(country => country.code === player.country)
      );
    }

    const isTeamFull = this.props.selectedPlayers.length >= TEAM_SIZE;
    return (
      <Fragment>
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
              const isSelected = this.props.isPlayerSelected(player);
              return (
                <Grid item key={player.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <PlayerCard
                    disabled={
                      !isSelected &&
                      (isTeamFull ||
                        this.props.budget - this.props.amountSpent <
                          getPlayerCost(player))
                    }
                    player={player}
                    onClick={this.props.onPlayerCardClick}
                    selected={isSelected}
                  />
                </Grid>
              );
            })}
          </Grid>
        </GridWrapper>
        <TeamFooter
          budget={this.props.budget}
          amountSpent={this.props.amountSpent}
          onPlayerCardClick={this.props.onPlayerCardClick}
          players={this.props.selectedPlayers}
        />
      </Fragment>
    );
  }
}

// withUser is needed for user updates to bubble all the way down to the header
export default withUser(TeamBuilder);
