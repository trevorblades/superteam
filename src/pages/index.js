import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Footer from '../components/footer';
import Grid from '@material-ui/core/Grid';
import Helmet from 'react-helmet';
import Hidden from '@material-ui/core/Hidden';
import HowToPlay from '../components/how-to-play';
import Layout from '../components/layout';
import PlayerCard from '../components/player-card';
import Prizes from '../components/prizes';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import hero from '../assets/images/hero2.jpg';
import styled from '@emotion/styled';
import {Hero, PageWrapper} from '../components/common';
import {Link, graphql} from 'gatsby';
import {MdAdd} from 'react-icons/md';
import {cover} from 'polished';

const StyledHero = styled(Hero)({
  flexShrink: 0,
  color: 'white',
  backgroundImage: `url(${hero})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  overflow: 'hidden',
  position: 'relative'
});

const PlayerCards = styled.div({
  width: 300,
  margin: '0 auto',
  position: 'relative'
});

const PlayerCardWrapper = styled.div({
  transform: 'translate(-20%, -5%) rotate(-10deg)',
  ':not(:last-child)': {
    ...cover(),
    transform: 'translate(35%, 5%) rotate(12deg)'
  }
});

export default function Home(props) {
  return (
    <Layout>
      <Helmet>
        <title>Free fantasy esports</title>
      </Helmet>
      <StyledHero>
        <PageWrapper>
          <Grid container alignItems="center">
            <Grid item sm={12} md={6}>
              <Typography variant="h2" color="secondary" gutterBottom>
                Free <span style={{color: 'white'}}>fantasy CS:GO esports</span>
              </Typography>
              <Typography variant="body1" paragraph color="inherit">
                Build a team of current and future CS:GO superstars and win
                prizes based on your team&apos;s quarterly performance.
              </Typography>
              <Fab
                variant="extended"
                color="secondary"
                component={Link}
                to="/create"
              >
                <MdAdd size={24} style={{marginRight: 8}} />
                Create a team
              </Fab>
            </Grid>
            <Grid item md={6}>
              <Hidden smDown implementation="css">
                <PlayerCards>
                  <PlayerCardWrapper>
                    <PlayerCard static player={props.data.superteam.player1} />
                  </PlayerCardWrapper>
                  <PlayerCardWrapper>
                    <PlayerCard
                      raised
                      static
                      selected
                      player={props.data.superteam.player2}
                    />
                  </PlayerCardWrapper>
                </PlayerCards>
              </Hidden>
            </Grid>
          </Grid>
        </PageWrapper>
      </StyledHero>
      <HowToPlay />
      <Divider />
      <Prizes />
      <Footer />
    </Layout>
  );
}

Home.propTypes = {
  data: PropTypes.object.isRequired
};

export const query = graphql`
  {
    superteam {
      player1: player(id: "7398") {
        ...PlayerFragment
      }
      player2: player(id: "7687") {
        ...PlayerFragment
      }
    }
  }
`;
