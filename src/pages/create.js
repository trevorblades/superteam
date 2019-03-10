import Helmet from 'react-helmet';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import TeamBuilder from '../components/team-builder';
import {graphql} from 'gatsby';

export default function Create(props) {
  // TODO: move continent/region attribute to the database
  const {continents} = props.data.countries;
  const players = props.data.superteam.players.map(player => {
    // find the continent code for the player's country
    const {code: region} = continents.find(({countries}) =>
      countries.some(country => country.code === player.country)
    );

    return {
      ...player,
      region
    };
  });

  // filter out continents with no players
  const regions = continents.filter(continent =>
    players.some(player => player.region === continent.code)
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
