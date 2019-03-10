import Helmet from 'react-helmet';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import TeamBuilder from '../components/team-builder';
import {graphql} from 'gatsby';

export default function Create(props) {
  const {players} = props.data.superteam;
  const countries = Array.from(new Set(players.map(player => player.country)));
  return (
    <Layout>
      <Helmet>
        <title>Create a team</title>
      </Helmet>
      <TeamBuilder
        players={players}
        regions={props.data.countries.regions.filter(region =>
          region.countries.some(country => countries.includes(country.code))
        )}
      />
    </Layout>
  );
}

Create.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
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
`;
