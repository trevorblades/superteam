import Helmet from 'react-helmet';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import TeamBuilder from '../components/team-builder';
import {AVERATE_PLAYER_COST} from '../utils/constants';
import {graphql} from 'gatsby';

export default function Create(props) {
  // TODO: move continent/region attribute to the database
  const {continents} = props.data.countries;
  const players = props.data.superteam.players.map(player => {
    const cost = AVERATE_PLAYER_COST * (player.percentile + 0.5);
    const continent = continents.find(({countries}) =>
      countries.some(country => country.code === player.country)
    );

    return {
      ...player,
      cost: Math.round(cost),
      region: continent.code
    };
  });

  // get a distinct set of countries from the players
  const countries = Array.from(new Set(players.map(player => player.country)));

  // filter out continents with no players
  const regions = continents.filter(continent =>
    continent.countries.some(country => countries.includes(country.code))
  );

  return (
    <Layout>
      <Helmet>
        <title>Create a team</title>
      </Helmet>
      <TeamBuilder players={players} regions={regions} />
    </Layout>
  );
}

Create.propTypes = {
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
    superteam {
      players {
        id
        name
        ign
        image
        country
        rating
        percentile
        team {
          id
          name
          logo
        }
        statistics {
          kdRatio
          damagePerRound
          headshots
        }
      }
    }
  }
`;
