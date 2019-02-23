import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

export default function Home(props) {
  return (
    <Layout>
      <table border="1">
        <thead>
          <tr>
            <th>IGN</th>
            <th>Name</th>
            <th>Team</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {props.data.hltv.teamRankings.flatMap(teamRanking =>
            teamRanking.team.players.map(player => (
              <tr key={player.id}>
                <td>{player.ign}</td>
                <td>{player.name}</td>
                <td>{teamRanking.team.name}</td>
                <td>{player.country.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Layout>
  );
}

Home.propTypes = {
  data: PropTypes.object.isRequired
};

// TODO: look into adding data from countries API
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
