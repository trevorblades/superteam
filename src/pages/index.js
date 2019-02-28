import Game from '../components/game';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

export default function App(props) {
  const {playerRanking} = props.data.hltv;
  const {continents} = props.data.countries;

  const playerCountries = playerRanking.map(({player}) => player.country.code);
  const distinctCountries = Array.from(new Set(playerCountries));
  const filteredContinents = continents.filter(continent =>
    continent.countries.some(country =>
      distinctCountries.includes(country.code)
    )
  );

  const ratings = playerRanking.map(({rating}) => rating);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  return (
    <Layout>
      <Game
        delta={maxRating - minRating}
        minRating={minRating}
        filteredContinents={filteredContinents}
        playerRanking={playerRanking}
        regions={filteredContinents.reduce(
          (acc, continent) => ({
            ...acc,
            [continent.code]: continent.countries.map(country => country.code)
          }),
          {}
        )}
      />
    </Layout>
  );
}

App.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  {
    countries {
      continents {
        code
        name
        countries {
          code
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
