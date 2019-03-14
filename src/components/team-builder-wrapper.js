import PropTypes from 'prop-types';
import React, {Component} from 'react';
import getPlayerCost from '../utils/get-player-cost';
import styled from '@emotion/styled';
import withUser from './with-user';
import {StaticQuery, graphql} from 'gatsby';
import {cover} from 'polished';

const Container = styled.div(cover(), {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto'
});

class Wrapper extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    amountSpent: PropTypes.number,
    selectedPlayers: PropTypes.array
  };

  static defaultProps = {
    amountSpent: 0,
    selectedPlayers: []
  };

  constructor(props) {
    super(props);
    this.state = {
      amountSpent: props.amountSpent,
      selectedPlayers: props.selectedPlayers
    };
  }

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
          return (
            <Container>
              {this.props.children({
                players,
                regions,
                selectedPlayers,
                amountSpent: this.state.amountSpent,
                onPlayerCardClick: this.onPlayerCardClick,
                isPlayerSelected: this.isPlayerSelected
              })}
            </Container>
          );
        }}
      />
    );
  }
}

// withUser is needed for user updates to bubble all the way down to the header
export default withUser(Wrapper);
