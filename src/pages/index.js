import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

export default function Home(props) {
  return (
    <Layout>
      {props.data.hltv.teamRankings.flatMap(teamRanking =>
        teamRanking.team.players.map(player => (
          <div key={player.id}>
            <h3>{player.ign}</h3>
            <h4>{player.name}</h4>
            <h5>{teamRanking.team.name}</h5>
            <h5>{player.country.name}</h5>
          </div>
        ))
      )}
    </Layout>
  );
}

Home.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  {
    hltv {
      teamRankings {
        team {
          name
          players {
            id
            name
            ign
            country {
              name
              code
            }
          }
        }
      }
    }
  }
`;
