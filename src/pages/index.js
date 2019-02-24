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
  return (
    <Layout>
      <Container>
        <Grid container spacing={24}>
          {props.data.hltv.teamRankings.flatMap(teamRanking =>
            teamRanking.team.players.map(player => (
              <Grid item key={player.id} xs={3}>
                <Typography variant="h6">{player.ign}</Typography>
                <Typography variant="caption" gutterBottom>
                  {player.name}
                </Typography>
                <Typography>{teamRanking.team.name}</Typography>
                <Typography>{player.country.name}</Typography>
              </Grid>
            ))
          )}
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
