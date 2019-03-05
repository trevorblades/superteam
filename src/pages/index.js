import App from '../components/app';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import {AVERATE_PLAYER_COST} from '../utils/constants';
import {graphql} from 'gatsby';

export default function Home(props) {
  const ratings = props.data.csgo.players.map(player => player.rating);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const delta = maxRating - minRating;

  const players = props.data.csgo.players.map(player => {
    const percentile = (player.rating - minRating) / delta;
    const cost = AVERATE_PLAYER_COST * (percentile + 0.5);
    const continent = props.data.countries.continents.find(({countries}) =>
      countries.some(country => country.code === player.country)
    );

    return {
      ...player,
      percentile,
      cost: Math.round(cost),
      region: continent.code
    };
  });

  // get a distinct set of countries from the players
  const countries = Array.from(new Set(players.map(player => player.country)));

  // filter out continents with no players
  const continents = props.data.countries.continents.filter(continent =>
    continent.countries.some(country => countries.includes(country.code))
  );

  return (
    <Layout>
      <App players={players} continents={continents} />
    </Layout>
  );
}

Home.propTypes = {
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
    csgo {
      players {
        id
        name
        ign
        image
        country
        rating
        team {
          id
          name
          logo
        }
        statistics {
          rating
          kdRatio
          damagePerRound
          headshots
        }
      }
    }
  }
`;
