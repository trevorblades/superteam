import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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

const FlexAlignCenter = styled.div({
  display: 'flex',
  alignItems: 'center'
});

const TeamLogo = styled.img({
  height: 32,
  marginRight: 8
});

const flagHeight = 24;
const Flag = styled.img({
  height: flagHeight,
  marginRight: 8
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
          {players.map(player => {
            const {logo, name: teamName} = player.team;
            return (
              <Grid item key={player.id} xs={3}>
                <Card>
                  <CardContent>
                    <FlexAlignCenter>
                      <TeamLogo src={logo} alt={teamName} title={teamName} />
                      <Typography variant="h6">{player.ign}</Typography>
                    </FlexAlignCenter>
                    <Typography variant="caption" gutterBottom>
                      {player.name}
                    </Typography>
                    <FlexAlignCenter>
                      <Flag
                        src={`https://www.countryflags.io/${
                          player.country.code
                        }/flat/${flagHeight * 2}.png`}
                      />
                      <Typography>{player.country.name}</Typography>
                    </FlexAlignCenter>
                    <Typography>{player.statistics.rating}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
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
              logo
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
