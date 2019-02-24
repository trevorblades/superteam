import Grid from '@material-ui/core/Grid';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import {graphql} from 'gatsby';

const Container = styled.div({
  padding: 40
});

export default function Home(props) {
  const players = props.data.hltv.teamRankings.flatMap(
    teamRanking => teamRanking.team.players
  );

  players.sort((a, b) => b.statistics.rating - a.statistics.rating);

  return (
    <Layout>
      <Container>
        <Grid container spacing={24}>
          {players.map(player => (
            <Grid item key={player.id} xs={3}>
              <Typography variant="h6">{player.ign}</Typography>
              <Typography variant="caption" gutterBottom>
                {player.name}
              </Typography>
              <Typography>{player.statistics.rating}</Typography>
              <Typography>{player.team.name}</Typography>
              <Typography>
                <img
                  src={`https://www.countryflags.io/${
                    player.country.code
                  }/flat/24.png`}
                />
                {player.country.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}

Home.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  {
    hltv {
      teamRankings(limit: 10) {
        team {
          players {
            id
            name
            ign
            team {
              name
            }
            statistics {
              rating
            }
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
